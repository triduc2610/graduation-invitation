import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image, Edit3, X, ChevronLeft, ChevronRight, Eye, RefreshCw, Sparkles, Check } from 'lucide-react';
import { GALLERY_IMAGES, DEFAULT_MAIN_PHOTO } from '../data';

interface GalleryItem {
  url: string;
  caption: string;
}

export default function PhotoGallery() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [mainPhoto, setMainPhoto] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  // Temporary state for editing fields
  const [editUrls, setEditUrls] = useState<string[]>([]);
  const [editCaptions, setEditCaptions] = useState<string[]>([]);
  const [editMainPhotoUrl, setEditMainPhotoUrl] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedGallery = localStorage.getItem('grad_gallery_images');
    const savedMainPhoto = localStorage.getItem('grad_main_photo');

    if (savedGallery) {
      try {
        setImages(JSON.parse(savedGallery));
      } catch (e) {
        setImages(GALLERY_IMAGES);
      }
    } else {
      setImages(GALLERY_IMAGES);
    }

    if (savedMainPhoto) {
      setMainPhoto(savedMainPhoto);
    } else {
      setMainPhoto(DEFAULT_MAIN_PHOTO);
    }
  }, []);

  // Sync editing fields when edit modal opens
  useEffect(() => {
    if (isEditing) {
      setEditUrls(images.map(img => img.url));
      setEditCaptions(images.map(img => img.caption));
      setEditMainPhotoUrl(mainPhoto);
    }
  }, [isEditing, images, mainPhoto]);

  const handleSave = () => {
    const updatedGallery: GalleryItem[] = editUrls.map((url, i) => ({
      url: url || GALLERY_IMAGES[i].url,
      caption: editCaptions[i] || 'abc'
    }));

    const updatedMain = editMainPhotoUrl || DEFAULT_MAIN_PHOTO;

    setImages(updatedGallery);
    setMainPhoto(updatedMain);
    
    localStorage.setItem('grad_gallery_images', JSON.stringify(updatedGallery));
    localStorage.setItem('grad_main_photo', updatedMain);

    // Fire an event to notify other components (like InteractiveScroll) of the photo change
    window.dispatchEvent(new Event('grad_photo_updated'));

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditing(false);
    }, 1200);
  };

  const handleReset = () => {
    if (window.confirm('Bạn có chắc chắn muốn đặt lại tất cả hình ảnh về mặc định không?')) {
      setImages(GALLERY_IMAGES);
      setMainPhoto(DEFAULT_MAIN_PHOTO);
      localStorage.removeItem('grad_gallery_images');
      localStorage.removeItem('grad_main_photo');
      window.dispatchEvent(new Event('grad_photo_updated'));
      setIsEditing(false);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex(prev => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex(prev => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
    }
  };

  return (
    <section id="graduation-photo-gallery" className="w-full py-12 border-t border-slate-900/80">
      <div className="text-center mb-8 relative">
        <span className="font-display text-xs tracking-widest text-gold font-bold uppercase">ALBUM KỶ NIỆM TỐT NGHIỆP</span>
        <h3 className="font-display text-2xl font-bold text-white mt-1">Nhìn Lại Hành Trình</h3>
        <p className="text-gray-400 font-serif text-xs italic mt-1 max-w-md mx-auto">
          Nhấp vào bất kỳ ảnh nào để xem kích thước đầy đủ hoặc tùy chỉnh bộ sưu tập ảnh của bạn.
        </p>
      </div>

      {/* Grid Layout of Polaroid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto px-2">
        {images.map((img, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setActiveLightboxIndex(index)}
            className="group rounded-xl overflow-hidden border border-slate-800 bg-slate-900/40 p-3 shadow-md flex flex-col hover:border-gold/40 hover:shadow-gold/5 transition-all duration-300 relative cursor-pointer"
          >
            {/* Image Container with subtle polaroid feel */}
            <div className="w-full h-56 overflow-hidden rounded-lg relative">
              <img
                src={img.url}
                alt={`Graduation Memory ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              
              {/* Eye icon overlay on hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-slate-950/80 border border-gold/40 flex items-center justify-center text-gold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <Eye className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Caption Area */}
            <div className="pt-3 pb-1 flex-grow flex items-center justify-center min-h-[44px]">
              <p className="font-serif text-xs text-gray-400 leading-relaxed text-center italic group-hover:text-gold-light transition-colors duration-300">
                {img.caption}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Cinematic Fullscreen Lightbox Overlay */}
      <AnimatePresence>
        {activeLightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveLightboxIndex(null)}
            className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4 backdrop-blur-sm"
          >
            {/* Top Close Button */}
            <button
              onClick={() => setActiveLightboxIndex(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-900/60 border border-slate-800 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image display */}
            <div className="relative max-w-4xl w-full max-h-[75vh] flex items-center justify-center">
              {/* Prev Button */}
              <button
                onClick={handlePrev}
                className="absolute left-2 sm:-left-16 p-3 rounded-full bg-slate-900/80 border border-slate-800 text-gold hover:text-white transition-colors cursor-pointer z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <motion.img
                key={activeLightboxIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                src={images[activeLightboxIndex].url}
                alt="Enlarged Memory"
                className="max-w-full max-h-[75vh] object-contain rounded-lg border border-slate-800 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
                referrerPolicy="no-referrer"
              />

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="absolute right-2 sm:-right-16 p-3 rounded-full bg-slate-900/80 border border-slate-800 text-gold hover:text-white transition-colors cursor-pointer z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom Caption */}
            <div className="mt-6 text-center max-w-xl px-4">
              <p className="font-serif text-sm text-gold-light italic">
                {images[activeLightboxIndex].caption}
              </p>
              <p className="text-gray-500 font-sans text-[10px] tracking-widest uppercase mt-2">
                Ảnh {activeLightboxIndex + 1} trên {images.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Overlay Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl relative"
            >
              <button
                onClick={() => setIsEditing(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6 flex items-center gap-2">
                <Image className="w-5 h-5 text-gold" />
                <h3 className="font-display text-lg font-bold text-white tracking-wide">
                  Tùy Chỉnh Album Hình Ảnh Cá Nhân
                </h3>
              </div>

              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                
                {/* 1. Main Scroll Photo */}
                <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-sans text-gold font-bold tracking-wider uppercase flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      1. Ảnh trong thư mời chính thức
                    </span>
                    <span className="text-[10px] text-gray-500 font-serif italic">Hiển thị trong cuộn thư</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                    <div className="sm:col-span-3">
                      <label className="text-[10px] text-gray-400 font-sans tracking-wide block mb-1">
                        URL Hình Ảnh
                      </label>
                      <input
                        type="text"
                        placeholder="Dán link ảnh (https://...)"
                        value={editMainPhotoUrl}
                        onChange={(e) => setEditMainPhotoUrl(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-serif text-xs focus:outline-none focus:border-gold/60"
                      />
                    </div>
                    <div className="w-full h-16 rounded overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
                      {editMainPhotoUrl ? (
                        <img src={editMainPhotoUrl} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <span className="text-[10px] text-gray-600 font-serif">Trống</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Gallery Photos */}
                <div className="space-y-4">
                  <span className="text-xs font-sans text-gold font-bold tracking-wider uppercase block">
                    2. Các ảnh trong Album Kỷ Niệm (4 ảnh)
                  </span>

                  {editUrls.map((url, idx) => (
                    <div key={idx} className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl space-y-3">
                      <div className="text-[11px] font-sans text-gray-400 font-semibold">
                        ẢNH SỐ {idx + 1}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                        {/* URL and Caption fields */}
                        <div className="sm:col-span-9 space-y-2">
                          <div>
                            <label className="text-[10px] text-gray-500 font-sans tracking-wide block mb-1">
                              URL Hình Ảnh
                            </label>
                            <input
                              type="text"
                              placeholder="Dán link ảnh (https://...)"
                              value={url}
                              onChange={(e) => {
                                const newUrls = [...editUrls];
                                newUrls[idx] = e.target.value;
                                setEditUrls(newUrls);
                              }}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-serif text-xs focus:outline-none focus:border-gold/60"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-gray-500 font-sans tracking-wide block mb-1">
                              Chú thích / Lời tự sự
                            </label>
                            <input
                              type="text"
                              placeholder="Nhập chú thích..."
                              value={editCaptions[idx]}
                              onChange={(e) => {
                                const newCaptions = [...editCaptions];
                                newCaptions[idx] = e.target.value;
                                setEditCaptions(newCaptions);
                              }}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-serif text-xs focus:outline-none focus:border-gold/60"
                            />
                          </div>
                        </div>

                        {/* Miniature Preview block */}
                        <div className="sm:col-span-3 h-20 rounded overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto sm:mx-0 w-24">
                          {url ? (
                            <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <span className="text-[10px] text-gray-600 font-serif">Không có ảnh</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Preset Suggestions for easy copy */}
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                  <div className="text-[11px] font-sans text-gray-400 font-bold tracking-wider">
                    GỢI Ý CÁC LINK ẢNH ĐẸP ĐỂ SỬ DỤNG:
                  </div>
                  <div className="text-[10px] font-serif text-gray-500 leading-relaxed space-y-1">
                    <p>• <b>Sân trường / Giảng đường:</b> https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800</p>
                    <p>• <b>Hội trường tốt nghiệp:</b> https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800</p>
                    <p>• <b>Tung mũ tốt nghiệp:</b> https://images.unsplash.com/photo-1627556704290-2b3f585afaf7?q=80&w=800</p>
                    <p>• <b>Nhóm bạn bè cùng vui:</b> https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800</p>
                    <p>• <b>Lễ đường ấm cúng:</b> https://images.unsplash.com/photo-1525921429624-479b6c294521?q=80&w=800</p>
                  </div>
                </div>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
