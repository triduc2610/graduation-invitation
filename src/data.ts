import { GraduationEvent, Wish } from './types';

import img1 from './components/images/z7975246162041_4a74358ab2138862a80041eaaeb7fef3.jpg';
import img2 from './components/images/z7975246174595_e06831cf010a82b5026c1e43cf17738d.jpg';
import img3 from './components/images/z7975246179940_458b60dafe19d878738f6d0caee24523.jpg';
import img4 from './components/images/z7975246182050_e88df6865640810b4167284aebd73ba5.jpg';
import imgMain from './components/images/z7975254915975_a3ac5f33fe6d6bd688d3d2950f9d2352.jpg';

export const DEFAULT_MAIN_PHOTO = imgMain;

export const GRADUATION_INFO: GraduationEvent = {
  title: "Lễ Tốt Nghiệp",
  graduateName: "HOÀNG VŨ NHẬT LINH",
  degreeName: "Cử nhân ngành Sự Kiện",
  honors: "Tốt nghiệp Xuất sắc",
  universityName: "Trường Khoa học liên ngành và Nghệ thuật",
  date: "2026-07-12T10:00:00-07:00", // July 12, 2026 @ 10:00 AM
  ceremonyTime: "10:00 Sáng - 12:00 Trưa",
  receptionTime: "12:30 Trưa - 3:00 Chiều",
  venueName: "Trường Khoa học liên ngành và Nghệ thuật",
  venueAddress: "Ngõ 6 phố Trần Hữu Dực, Nam Từ Liêm, Hà Nội",
  mapEmbedUrl: "https://maps.google.com/maps?q=Tr%C6%B0%E1%BB%9Dng%20Khoa%20h%E1%BB%8Dc%20li%C3%AAn%20ng%C3%A0nh%20v%C3%A0%20Ngh%E1%BB%87%20thu%E1%BA%ADt%2C%20%C4%90%E1%BA%A1i%20h%E1%BB%8Dc%20Qu%E1%BB%91c%20gia%20H%C3%A0%20N%E1%BB%99i%20(VNU-SIS)&t=&z=16&ie=UTF8&iwloc=&output=embed",
  lat: 37.4275,
  lng: -122.1691,
  rsvpDeadline: "2026-07-05T23:59:59-07:00"
};

export const TIMELINE_EVENTS = [
  {
    time: "09:00 Sáng",
    title: "Lễ tốt nghiệp",
    description: "Lễ tốt nghiệp bắt đầu",
    icon: "GraduationCap"
  },
  {
    time: "10:00 Sáng",
    title: "Nghi lễ Trao bằng",
    description: "Trao bằng cho sinh viên tốt nghiệp",
    icon: "Scroll"
  },
  {
    time: "12:00 Trưa",
    title: "Chụp ảnh",
    description: "Chụp ảnh kỷ niệm cùng gia đình, thầy cô và bạn bè.",
    icon: "Sparkles"
  }
];

export const GALLERY_IMAGES = [
  {
    url: img1,
    caption: "abc"
  },
  {
    url: img2,
    caption: "abc"
  },
  {
    url: img3,
    caption: "abc"
  },
  {
    url: img4,
    caption: "abc"
  }
];

export const INITIAL_WISHES: Wish[] = [
  {
    id: "w1",
    name: "Professor Alistair Vance",
    message: "Emily, it has been an absolute privilege advising your research thesis. Your work on biodegradable scaffold structures is groundbreaking and highly deserving of the Research Excellence Award. Wishing you the absolute best in your PhD journey at MIT!",
    relation: "professor",
    timestamp: Date.now() - 3600000 * 24, // 1 day ago
    avatarSeed: "Prof"
  },
  {
    id: "w2",
    name: "Arthur and Margaret Harrison",
    message: "Our dearest Emily, words cannot describe how incredibly proud we are of you. To see you walk across that stage and graduate Summa Cum Laude is the fulfillment of all our prayers. Your bright future starts today, and we will always be here cheering you on!",
    relation: "family",
    timestamp: Date.now() - 3600000 * 12, // 12 hours ago
    avatarSeed: "Parents"
  },
  {
    id: "w3",
    name: "Jessica Chen",
    message: "WE DID IT EMILY!!! From crying over organic chemistry labs at 3 AM to wearing these graduation gowns! You are the smartest, most supportive roommate ever. Can't wait to toss our caps! Let's conquer the world together! 🎓❤️🎉",
    relation: "friend",
    timestamp: Date.now() - 3600000 * 5, // 5 hours ago
    avatarSeed: "Jess"
  },
  {
    id: "w4",
    name: "Dr. Robert Sterling",
    message: "Congratulations Emily on this milestone! Your dedication in the Bio-design Lab set a high bar for future student researchers. I have no doubt you will bring the same energy and intellect to your future ventures.",
    relation: "professor",
    timestamp: Date.now() - 3600000 * 2, // 2 hours ago
    avatarSeed: "Sterling"
  }
];
