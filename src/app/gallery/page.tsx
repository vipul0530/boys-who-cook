import Image from "next/image";
import { getGallery } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Gallery" };

export default function GalleryPage() {
  const photos = getGallery();

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">Gallery</h1>
          <p className="text-white/85 text-lg">
            Snapshots of the action — cooking, learning, and community.
          </p>
        </div>
      </div>

      {/* Gallery Grid */}
      <section className="section">
        <div className="container">
          {photos.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-7xl mb-5">📷</div>
              <h2 className="text-2xl font-bold font-heading text-gray-700 mb-3">
                No photos yet
              </h2>
              <p className="text-gray-500 max-w-md mx-auto">
                Upload photos through the Admin panel at{" "}
                <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">/admin</code>{" "}
                under the Gallery section.
              </p>
            </div>
          ) : (
            <>
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                {photos.map((photo) => (
                  <div
                    key={photo.slug}
                    className="gallery-item break-inside-avoid relative group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                  >
                    <Image
                      src={photo.image}
                      alt={photo.title}
                      width={400}
                      height={300}
                      className="w-full object-cover"
                    />
                    {/* Caption overlay */}
                    <div className="gallery-overlay absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                      <p className="text-white text-sm font-medium">{photo.title}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-center text-gray-400 text-sm mt-8">
                {photos.length} photo{photos.length !== 1 ? "s" : ""}
              </p>
            </>
          )}
        </div>
      </section>
    </>
  );
}
