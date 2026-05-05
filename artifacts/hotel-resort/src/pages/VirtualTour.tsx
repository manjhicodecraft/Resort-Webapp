import { useState } from "react";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { GALLERY_IMAGES } from "@/data/demo";

const TOUR_VIDEOS = [
  {
    title: "Grand Azure Resort — Full Property Tour",
    youtubeId: "2QjcPN_4dGc",
    description: "Take a complete walkthrough of our stunning resort, from the grand lobby to the beachfront villas.",
  },
  {
    title: "Luxury Spa & Wellness Center",
    youtubeId: "6CJyMqJmGpk",
    description: "Explore our world-class spa featuring traditional Ayurvedic treatments and modern wellness therapies.",
  },
  {
    title: "Fine Dining Experience",
    youtubeId: "9f06QZCVUHg",
    description: "Journey through our award-winning restaurants offering coastal, Indian, and international cuisines.",
  },
];

export default function VirtualTour() {
  const [activeVideo, setActiveVideo] = useState(0);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [playVideo, setPlayVideo] = useState(false);

  const nextImg = () => setGalleryIdx(i => (i + 1) % GALLERY_IMAGES.length);
  const prevImg = () => setGalleryIdx(i => (i - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);

  return (
    <div className="min-h-screen pt-16 bg-[hsl(40,20%,97%)]">
      <PageHeader
        eyebrow="Immersive Experience"
        title="Virtual Tour"
        description="Explore Grand Azure Resort from the comfort of your home. Take a virtual journey through our beautiful property."
        image="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1920&auto=format&fit=crop"
        testId="section-tour-header"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Video Player */}
        <div className="mb-10" data-testid="section-video-tour">
          <div className="relative bg-black rounded-2xl overflow-hidden shadow-xl" style={{ aspectRatio: "16/9" }}>
            {playVideo ? (
              <iframe
                src={`https://www.youtube.com/embed/${TOUR_VIDEOS[activeVideo].youtubeId}?autoplay=1`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={TOUR_VIDEOS[activeVideo].title}
              />
            ) : (
              <>
                <img
                  src={`https://img.youtube.com/vi/${TOUR_VIDEOS[activeVideo].youtubeId}/maxresdefault.jpg`}
                  alt={TOUR_VIDEOS[activeVideo].title}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => setPlayVideo(true)}
                    className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/60 hover:bg-white/30 transition-all group"
                    data-testid="button-play-video"
                  >
                    <Play className="w-8 h-8 text-white fill-white ml-1 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 p-6">
                  <h3 className="font-serif text-white text-xl font-semibold">{TOUR_VIDEOS[activeVideo].title}</h3>
                  <p className="text-gray-300 text-sm mt-1">{TOUR_VIDEOS[activeVideo].description}</p>
                </div>
              </>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            {TOUR_VIDEOS.map((v, i) => (
              <button
                key={i}
                onClick={() => { setActiveVideo(i); setPlayVideo(false); }}
                className={`rounded-xl overflow-hidden text-left transition-all ${activeVideo === i ? "ring-2 ring-[hsl(42,75%,52%)]" : "opacity-70 hover:opacity-100"}`}
                data-testid={`button-tour-video-${i}`}
              >
                <img
                  src={`https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg`}
                  alt={v.title}
                  className="w-full aspect-video object-cover"
                />
                <div className="p-2 bg-white">
                  <p className="text-xs font-medium text-gray-900 line-clamp-1">{v.title}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Photo Gallery */}
        <div data-testid="section-photo-gallery">
          <div className="text-center mb-6">
            <h2 className="font-serif text-2xl font-bold text-gray-900">Photo Gallery</h2>
            <p className="text-gray-600 text-sm mt-1">Browse through our stunning resort imagery</p>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-xl mb-4" style={{ aspectRatio: "16/7" }}>
            <img
              src={GALLERY_IMAGES[galleryIdx].url}
              alt={GALLERY_IMAGES[galleryIdx].caption}
              className="w-full h-full object-cover"
              data-testid="img-gallery-main"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent flex items-end p-6">
              <p className="text-white font-serif text-xl font-semibold">{GALLERY_IMAGES[galleryIdx].caption}</p>
            </div>
            <button onClick={prevImg} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-all" data-testid="button-gallery-prev">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={nextImg} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-all" data-testid="button-gallery-next">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {GALLERY_IMAGES.map((img, i) => (
              <button
                key={i}
                onClick={() => setGalleryIdx(i)}
                className={`shrink-0 w-20 h-16 rounded-lg overflow-hidden transition-all ${galleryIdx === i ? "ring-2 ring-[hsl(42,75%,52%)]" : "opacity-60 hover:opacity-90"}`}
                data-testid={`button-gallery-thumb-${i}`}
              >
                <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
