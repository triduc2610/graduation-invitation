import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ClipboardList, Send, Users, AlertCircle, X } from 'lucide-react';
import { RSVP, Wish } from '../types';

/**
 * HƯỚNG DẪN THIẾT LẬP KẾT NỐI GOOGLE SHEETS QUA CODE:
 * 
 * 1. Tạo một Google Sheet mới trên Google Drive của bạn.
 * 2. Vào Tiện ích mở rộng (Extensions) > Apps Script.
 * 3. Xóa hết code mặc định và dán đoạn mã Apps Script dưới đây vào:
 * 
 * ```javascript
 * function doPost(e) {
 *   var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
 *   if (sheet.getLastRow() === 0) {
 *     sheet.appendRow(["Thời gian", "Họ tên", "Email", "Tham dự", "Số lượng khách", "Mối quan hệ", "Lời chúc"]);
 *     sheet.getRange(1, 1, 1, 7).setFontWeight("bold").setBackground("#d4af37").setFontColor("#0f172a");
 *   }
 *   try {
 *     var params = e.parameter;
 *     if (e.postData && e.postData.contents) {
 *       try { params = JSON.parse(e.postData.contents); } catch (e) {}
 *     }
 *     var name = params.name || "";
 *     var email = params.email || "";
 *     var isAttending = params.isAttending === "true" || params.isAttending === true ? "Có" : "Không";
 *     var guestsCount = params.guestsCount || "0";
 *     var relation = params.relation || "";
 *     var message = params.message || "";
 *     
 *     var relationVi = relation;
 *     if (relation === "family") relationVi = "Gia đình";
 *     else if (relation === "friend") relationVi = "Bạn bè";
 *     else if (relation === "teacher") relationVi = "Thầy cô / Đồng nghiệp";
 *     else if (relation === "other") relationVi = "Khác";
 * 
 *     var timestamp = new Date();
 *     var formattedDate = Utilities.formatDate(timestamp, "GMT+7", "yyyy-MM-dd HH:mm:ss");
 *     sheet.appendRow([formattedDate, name, email, isAttending, guestsCount, relationVi, message]);
 *     
 *     return ContentService.createTextOutput(JSON.stringify({ "status": "success" }))
 *       .setMimeType(ContentService.MimeType.JSON)
 *       .setHeader("Access-Control-Allow-Origin", "*");
 *   } catch (err) {
 *     return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": err.toString() }))
 *       .setMimeType(ContentService.MimeType.JSON)
 *       .setHeader("Access-Control-Allow-Origin", "*");
 *   }
 * }
 * ```
 * 
 * 4. Nhấp vào Triển khai (Deploy) > Tùy chọn triển khai mới (New deployment).
 * 5. Chọn loại là "Ứng dụng web" (Web app), mục "Người có quyền truy cập" cấu hình chọn "Bất kỳ ai" (Anyone).
 * 6. Copy URL ứng dụng web nhận được và dán vào biến VITE_RSVP_SHEET_URL trong file `.env` hoặc hằng số `RSVP_SHEET_URL` ở ngay dưới đây!
 */

// ĐỊNH NGHĨA LINK GOOGLE APPS SCRIPT WEB APP CỦA BẠN TẠI ĐÂY:
const RSVP_SHEET_URL = import.meta.env.VITE_RSVP_SHEET_URL || "";

interface RSVPFormProps {
  onRsvpSuccess: () => void;
  onNewWishAdded?: (wish: Wish) => void;
}

export default function RSVPForm({ onRsvpSuccess, onNewWishAdded }: RSVPFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAttending, setIsAttending] = useState<boolean | null>(null);
  const [guestsCount, setGuestsCount] = useState(1);
  const [relation, setRelation] = useState('friend');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Vui lòng nhập họ và tên của bạn.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }
    if (isAttending === null) {
      setErrorMsg('Vui lòng cho biết bạn có thể tham dự hay không.');
      return;
    }

    setIsSubmitting(true);

    const submitRsvp = async () => {
      try {
        const newRsvp: RSVP = {
          id: `rsvp_${Date.now()}`,
          name: name.trim(),
          email: email.trim(),
          isAttending,
          guestsCount: isAttending ? guestsCount : 0,
          relation,
          message: message.trim() || undefined,
          timestamp: Date.now()
        };

        // 1. Save RSVP to LocalStorage
        const existingRsvpsRaw = localStorage.getItem('graduation_rsvps');
        const existingRsvps: RSVP[] = existingRsvpsRaw ? JSON.parse(existingRsvpsRaw) : [];
        existingRsvps.push(newRsvp);
        localStorage.setItem('graduation_rsvps', JSON.stringify(existingRsvps));

        // 2. If attending and there is a message, add to Wishes
        if (message.trim()) {
          const newWish: Wish = {
            id: `wish_${Date.now()}`,
            name: name.trim(),
            message: message.trim(),
            relation: relation as any,
            timestamp: Date.now(),
            avatarSeed: name.trim().slice(0, 3)
          };

          const existingWishesRaw = localStorage.getItem('graduation_wishes');
          const existingWishes: Wish[] = existingWishesRaw ? JSON.parse(existingWishesRaw) : [];
          existingWishes.push(newWish);
          localStorage.setItem('graduation_wishes', JSON.stringify(existingWishes));

          // Notify parent so the wishes board updates instantly!
          if (onNewWishAdded) {
            onNewWishAdded(newWish);
          }
        }

        // 3. Write to Google Sheets (if configured)
        const activeSheetUrl = RSVP_SHEET_URL;
        if (activeSheetUrl && activeSheetUrl.trim().startsWith('http')) {
          try {
            const formData = new URLSearchParams();
            formData.append('name', name.trim());
            formData.append('email', email.trim());
            formData.append('isAttending', isAttending ? 'true' : 'false');
            formData.append('guestsCount', isAttending ? guestsCount.toString() : '0');
            formData.append('relation', relation);
            formData.append('message', message.trim());
            formData.append('timestamp', new Date().toISOString());

            await fetch(activeSheetUrl.trim(), {
              method: 'POST',
              body: formData,
              mode: 'no-cors', // Completely resolves browser CORS errors
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            });
          } catch (sheetErr) {
            console.error('Failed to submit RSVP to Google Sheet:', sheetErr);
          }
        }

        setIsSubmitting(false);
        setIsSubmitted(true);
        onRsvpSuccess();
      } catch (err) {
        console.error(err);
        setErrorMsg('Có lỗi xảy ra khi lưu phản hồi. Vui lòng thử lại.');
        setIsSubmitting(false);
      }
    };

    // Simulate short network delay for polished UX
    setTimeout(submitRsvp, 1000);
  };


  const resetForm = () => {
    setName('');
    setEmail('');
    setIsAttending(null);
    setGuestsCount(1);
    setRelation('friend');
    setMessage('');
    setIsSubmitted(false);
  };

  return (
    <div id="rsvp-section-card" className="w-full max-w-xl bg-gradient-to-br from-slate-900 via-slate-950 to-navy-dark border border-gold/30 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
      
      {/* Visual top border accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-gold via-amber-200 to-gold" />
      
      {/* Decorative emblem */}
      <div className="absolute -top-10 -right-10 opacity-5 select-none pointer-events-none">
        <ClipboardList className="w-40 h-40 text-gold" />
      </div>

      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold font-display text-[10px] tracking-widest font-semibold mb-3">
          <Users className="w-3.5 h-3.5" />
          XÁC NHẬN THAM GIA
        </div>
        <h3 className="font-display text-2xl font-bold text-white tracking-wide">
          Đăng ký Tham dự 
        </h3>
      </div>

      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.form
            key="rsvp-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-5 text-left"
          >
            {/* Name Input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="rsvp-name" className="text-xs font-sans text-gray-300 font-semibold tracking-wider">
                HỌ VÀ TÊN
              </label>
              <input
                id="rsvp-name"
                type="text"
                placeholder="ABC"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-lg text-white font-serif text-base focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30 transition-colors placeholder:text-gray-600"
                disabled={isSubmitting}
              />
            </div>

            {/* Email Input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="rsvp-email" className="text-xs font-sans text-gray-300 font-semibold tracking-wider">
                ĐỊA CHỈ EMAIL
              </label>
              <input
                id="rsvp-email"
                type="email"
                placeholder="abc@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-lg text-white font-serif text-base focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30 transition-colors placeholder:text-gray-600"
                disabled={isSubmitting}
              />
            </div>

            {/* Attendance Toggle */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-sans text-gray-300 font-semibold tracking-wider">
                BẠN SẼ THAM DỰ CHỨ?
              </span>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setIsAttending(true)}
                  className={`py-3 px-4 rounded-lg border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    isAttending === true
                      ? 'bg-gold/15 border-gold text-gold-light font-bold'
                      : 'bg-slate-900/40 border-slate-700 text-gray-400 hover:border-slate-600 hover:text-white'
                  }`}
                  disabled={isSubmitting}
                >
                  <span className="font-display text-xs tracking-wider text-center">CÓ THỂ THAM DỰ</span>
                  <span className="text-[10px] font-serif italic text-gray-500">Tôi chắc chắn sẽ có mặt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsAttending(false)}
                  className={`py-3 px-4 rounded-lg border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    isAttending === false
                      ? 'bg-red-950/20 border-red-800 text-red-200 font-bold'
                      : 'bg-slate-900/40 border-slate-700 text-gray-400 hover:border-slate-600 hover:text-white'
                  }`}
                  disabled={isSubmitting}
                >
                  <span className="font-display text-xs tracking-wider text-center">KHÔNG THỂ THAM DỰ</span>
                  <span className="text-[10px] font-serif italic text-gray-500">Chỉ gửi lời chúc mừng từ xa</span>
                </button>
              </div>
            </div>

            {/* Interactive Conditional Fields */}
            <AnimatePresence>
              {isAttending === true && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-4 overflow-hidden"
                >
                  {/* Guest Count Selector */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="rsvp-guests" className="text-xs font-sans text-gray-300 font-semibold tracking-wider flex items-center justify-between">
                      <span>SỐ LƯỢNG</span>
                      <span className="text-[10px] text-gray-500 font-serif italic">Đã bao gồm chính bạn</span>
                    </label>
                    <select
                      id="rsvp-guests"
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-serif focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30 cursor-pointer"
                      disabled={isSubmitting}
                    >
                      <option value={1} className="bg-slate-900">1 người (Chỉ riêng tôi)</option>
                      <option value={2} className="bg-slate-900">2 người (Tôi + 1 người đi cùng)</option>
                      <option value={3} className="bg-slate-900">3 người (Tôi + 2 người thân/bạn bè)</option>
                      <option value={4} className="bg-slate-900">4 người (Tôi + 3 người thân/bạn bè)</option>
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Congratulations Message Box */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="rsvp-message" className="text-xs font-sans text-gray-300 font-semibold tracking-wider flex items-center justify-between">
                <span>LỜI CHÚC MỪNG</span>
                <span className="text-[10px] text-gray-500 font-serif italic">Lời chúc sẽ được lưu lại làm kỷ niệm</span>
              </label>
              <textarea
                id="rsvp-message"
                rows={3}
                placeholder="Chúc mừng bạn đã đạt được cột mốc học thuật tuyệt vời này! Chúc bạn mọi điều tốt đẹp nhất trên chặng đường sắp tới..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-lg text-white font-serif text-sm focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30 transition-colors placeholder:text-gray-600 resize-none"
                disabled={isSubmitting}
              />
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="flex items-center gap-2 text-red-400 bg-red-950/25 border border-red-900 px-4 py-3 rounded-lg text-sm font-serif">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-2 w-full py-3 bg-gradient-to-r from-gold-dark via-gold to-amber-500 text-slate-950 font-display font-black text-xs tracking-widest rounded-lg flex items-center justify-center gap-2 cursor-pointer hover:shadow-lg hover:brightness-105 active:scale-[0.99] transition-all disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  ĐANG XỬ LÝ & LƯU TRỮ...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-slate-950" />
                  GỬI PHẢN HỒI XÁC NHẬN
                </>
              )}
            </button>
          </motion.form>
        ) : (
          /* Success Screen */
          <motion.div
            key="rsvp-success"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center text-center py-8"
          >
            <div className="w-16 h-16 rounded-full bg-gold/20 border border-gold flex items-center justify-center mb-6">
              <Check className="w-8 h-8 text-gold" />
            </div>
            
            <h4 className="font-display text-xl font-bold text-white tracking-wide mb-2">
              Đã Ghi Nhận Phản Hồi!
            </h4>
            
            <p className="font-serif text-gray-300 max-w-sm mb-6 leading-relaxed">
              Cảm ơn bạn, <span className="text-gold font-semibold">{name}</span>! Trạng thái tham dự của bạn đã được ghi nhận vào danh sách khách mời của buổi lễ.
            </p>

            <div className="px-4 py-3 bg-slate-900/60 rounded-lg border border-slate-800 text-xs font-serif text-gray-400 mb-8 max-w-xs leading-normal">
              {isAttending ? (
                <span>Đã xác nhận <span className="text-white font-bold">{guestsCount} chỗ ngồi</span>. Rất mong đợi được chung vui cùng bạn!</span>
              ) : (
                <span>Rất tiếc vì bạn không thể có mặt, chân thành cảm ơn những lời chúc ấm áp và tốt đẹp của bạn.</span>
              )}
            </div>

            <button
              onClick={resetForm}
              className="px-6 py-2 border border-gold/30 text-gold hover:bg-gold/10 font-display text-[10px] tracking-widest font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <X className="w-3 h-3" />
              CHỈNH SỬA PHẢN HỒI
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
