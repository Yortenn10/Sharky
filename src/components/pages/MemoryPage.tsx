import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MemoryItem } from '../../types';
import { soundEngine } from '../../utils/audio';
import { Camera, Plus, Trash2, X, ZoomIn, ArrowRight, Image as ImageIcon, Heart, Calendar } from 'lucide-react';
import { SharkYubi } from '../SharkYubi';

interface MemoryPageProps {
  onGoToAffirmation: () => void;
}

const DEFAULT_MEMORIES: MemoryItem[] = [
  {
    id: 'm-1',
    title: 'Momen Senyum Manis Qiya',
    date: 'Hari Bahagia',
    imageUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80',
    caption: 'Senyuman hangat yang selalu berhasil mencairkan suasana dan membawa keceriaan.',
    tag: 'Kenangan Manis',
  },
  {
    id: 'm-2',
    title: 'Petualangan & Tawa Bersama',
    date: 'Hari Yang Seru',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    caption: 'Melihat pantai dan luasnya lautan, mengingatkan betapa luasnya harapan untuk Qiya.',
    tag: 'Suasana Laut',
  },
  {
    id: 'm-3',
    title: 'Langkah Hebat Qiya',
    date: 'Momen Istimewa',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    caption: 'Setiap proses dan kerja keras yang telah Qiya lewati dengan sangat hebat.',
    tag: 'Kebanggaan',
  },
];

export const MemoryPage: React.FC<MemoryPageProps> = ({ onGoToAffirmation }) => {
  const [memories, setMemories] = useState<MemoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('qiya_shark_memories');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return DEFAULT_MEMORIES;
  });

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activePhoto, setActivePhoto] = useState<MemoryItem | null>(null);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('qiya_shark_memories', JSON.stringify(memories));
    } catch {
      // ignore
    }
  }, [memories]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    soundEngine.playBubblePop();
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setNewImageUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl) return;

    soundEngine.playPearlCollect();
    const newItem: MemoryItem = {
      id: `mem-${Date.now()}`,
      title: newTitle.trim() || 'Momen Indah Qiya',
      date: newDate.trim() || 'Momen Spesial',
      caption: newCaption.trim() || 'Kenangan manis yang selalu berharga di hati.',
      imageUrl: newImageUrl,
      tag: 'Foto Kenangan',
    };

    setMemories([newItem, ...memories]);
    setNewTitle('');
    setNewDate('');
    setNewCaption('');
    setNewImageUrl('');
    setIsUploadOpen(false);
  };

  const handleDeleteMemory = (id: string) => {
    soundEngine.playBubblePop();
    setMemories((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 sm:py-12 select-none">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-[#397d8b]/40 mb-8"
      >
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-[#dfb16e] text-xs font-bold tracking-[0.25em] uppercase mb-2">
            <span>★</span>
            <span>ALBUM BAWAH LAUT QIYA</span>
          </div>
          <h1 className="font-serif-display text-3xl sm:text-4xl md:text-5xl text-[#f2f7f7] font-medium leading-tight">
            Galeri Memori & Jejak Cerita 📸
          </h1>
          <p className="font-quicksand text-xs sm:text-sm text-[#a5ced6] mt-1 max-w-xl">
            Setiap detik perjalananmu adalah kenangan berharga. Kamu bisa mengunggah foto-foto spesial Qiya di sini!
          </p>
        </div>

        {/* Action Button: Upload New Memory */}
        <button
          id="open-upload-memory-modal-btn"
          onClick={() => {
            soundEngine.playBubblePop();
            setIsUploadOpen(true);
          }}
          className="px-6 py-3 rounded-xl bg-[#dfb16e] hover:bg-[#eac47e] text-[#07252f] font-bold font-quicksand text-sm shadow-[0_10px_25px_rgba(223,177,110,0.3)] transition-all flex items-center gap-2 cursor-pointer shrink-0 border border-[#edd29b]/50"
        >
          <Plus className="w-4 h-4" />
          <span>Unggah Foto Memori Baru</span>
        </button>
      </motion.div>

      {/* Memory Photo Cards Grid (Polaroid Nautical Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
        {memories.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9, rotate: (idx % 2 === 0 ? -2 : 2) }}
            animate={{ opacity: 1, scale: 1, rotate: (idx % 2 === 0 ? -1.5 : 1.5) }}
            whileHover={{ scale: 1.04, rotate: 0, zIndex: 20 }}
            className="group relative bg-white/95 rounded-2xl p-3.5 pb-5 shadow-2xl text-slate-900 border-4 border-[#edd29b]/60 transition-all flex flex-col justify-between"
          >
            {/* Marine Pin / Washi Tape on top */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#dfb16e] rounded-md shadow-sm flex items-center justify-center text-[10px] text-[#07252f] font-extrabold tracking-widest uppercase">
              🦈 YUBI
            </div>

            {/* Photo Container */}
            <div
              onClick={() => {
                soundEngine.playBubblePop();
                setActivePhoto(item);
              }}
              className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-100 cursor-pointer mb-3 group-hover:brightness-105 transition-all shadow-inner"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-[#072732]/0 group-hover:bg-[#072732]/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="p-2 rounded-full bg-white/90 text-[#07252f] shadow-md">
                  <ZoomIn className="w-5 h-5" />
                </span>
              </div>
            </div>

            {/* Polaroid Description */}
            <div className="space-y-1.5 px-1">
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span className="flex items-center gap-1 font-quicksand">
                  <Calendar className="w-3 h-3 text-[#397d8b]" />
                  {item.date}
                </span>
                <span className="text-pink-500 flex items-center gap-0.5 font-quicksand">
                  <Heart className="w-3 h-3 fill-pink-500" />
                  Qiya
                </span>
              </div>

              <h3 className="font-serif-display font-semibold text-slate-900 text-base line-clamp-1">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-quicksand">
                {item.caption}
              </p>
            </div>

            {/* Delete button (subtle) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteMemory(item.id);
              }}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/60 text-white/80 hover:text-rose-400 hover:bg-slate-900 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              title="Hapus foto ini"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Floating Bottom Navigator: Go to Affirmation Page */}
      <div className="p-6 rounded-3xl bg-[#072732]/90 border border-[#397d8b]/60 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-3 text-left">
          <SharkYubi size="sm" pose="swimming" />
          <div>
            <div className="font-serif-display text-lg text-[#f2f7f7]">
              Semua memori Qiya begitu indah dan berharga! 💖
            </div>
            <div className="text-xs text-[#a5ced6] font-quicksand">
              Yubi punya kata-kata afirmasi dan penguat khusus yang ditulis di atas kertas samudra untukmu.
            </div>
          </div>
        </div>

        <button
          id="goto-affirmation-btn"
          onClick={() => {
            soundEngine.playBubblePop();
            onGoToAffirmation();
          }}
          className="px-8 py-3.5 sm:py-4 rounded-xl bg-[#dfb16e] hover:bg-[#eac47e] text-[#07252f] font-bold font-quicksand text-base shadow-[0_10px_25px_rgba(223,177,110,0.3)] transition-all flex items-center gap-2 cursor-pointer shrink-0 border border-[#edd29b]/50"
        >
          <span>Lanjut ke Kata-Kata Affirmation 📜</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* MODAL 1: Upload Photo */}
      <AnimatePresence>
        {isUploadOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 w-full max-w-md shadow-2xl relative text-white"
            >
              <button
                onClick={() => setIsUploadOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <Camera className="w-5 h-5 text-[#dfb16e]" />
                <h2 className="font-serif-display text-xl font-medium text-[#f2f7f7]">Unggah Foto Memori Qiya</h2>
              </div>

              <form onSubmit={handleAddMemory} className="space-y-4 font-quicksand">
                {/* File Upload Box */}
                <div>
                  <label className="block text-xs font-semibold text-[#a5ced6] mb-1">
                    Pilih File Foto (Galeri / Perangkat):
                  </label>
                  <label className="border-2 border-dashed border-[#397d8b]/60 hover:border-[#dfb16e] rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-[#061e27] transition-colors">
                    {newImageUrl ? (
                      <div className="relative w-full h-36 rounded-lg overflow-hidden">
                        <img
                          src={newImageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-2 right-2 text-[10px] bg-[#07252f]/90 text-[#dfb16e] px-2 py-1 rounded-md">
                          Ganti Foto
                        </span>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="w-8 h-8 text-[#dfb16e] mb-2" />
                        <span className="text-xs text-[#f2f7f7]">Klik untuk memilih foto</span>
                        <span className="text-[10px] text-[#a5ced6]/70">Mendukung JPG, PNG, WEBP</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-[#a5ced6] mb-1">
                    Judul Kenangan:
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Contoh: Senyuman Terbaik Qiya"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#061e27] border border-[#397d8b]/60 text-sm text-[#f2f7f7] focus:border-[#dfb16e] outline-none"
                    required
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-semibold text-[#a5ced6] mb-1">
                    Tanggal / Waktu:
                  </label>
                  <input
                    type="text"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    placeholder="Contoh: Ulang Tahun Ini / Liburan Bersama"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#061e27] border border-[#397d8b]/60 text-sm text-[#f2f7f7] focus:border-[#dfb16e] outline-none"
                  />
                </div>

                {/* Caption */}
                <div>
                  <label className="block text-xs font-semibold text-[#a5ced6] mb-1">
                    Catatan / Pesan Singkat:
                  </label>
                  <textarea
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    placeholder="Tuliskan cerita manis di balik foto ini..."
                    rows={2}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#061e27] border border-[#397d8b]/60 text-sm text-[#f2f7f7] focus:border-[#dfb16e] outline-none resize-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsUploadOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-[#061e27] text-[#a5ced6] text-xs font-semibold hover:bg-[#092b36] border border-[#397d8b]/40 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={!newImageUrl}
                    className="flex-1 py-2.5 rounded-xl bg-[#dfb16e] hover:bg-[#eac47e] text-[#07252f] text-xs font-bold font-quicksand disabled:opacity-50 cursor-pointer"
                  >
                    Simpan Foto 💾
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Photo Lightbox Preview */}
      <AnimatePresence>
        {activePhoto && (
          <div
            onClick={() => setActivePhoto(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl overflow-hidden max-w-lg w-full text-slate-900 shadow-2xl relative"
            >
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-slate-900/70 text-white hover:bg-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-full max-h-[65vh] overflow-hidden bg-slate-950">
                <img
                  src={activePhoto.imageUrl}
                  alt={activePhoto.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-6">
                <div className="text-xs text-[#397d8b] font-semibold mb-1 font-quicksand">
                  📅 {activePhoto.date}
                </div>
                <h3 className="text-xl font-serif-display font-semibold text-slate-900 mb-2">
                  {activePhoto.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-quicksand">
                  {activePhoto.caption}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
