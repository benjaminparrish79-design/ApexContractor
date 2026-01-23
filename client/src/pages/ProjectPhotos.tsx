import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Upload, Trash2, Download, Eye } from "lucide-react";
import { trpc } from "@/lib/trpc";

/**
 * Project Photos Gallery - Upload, organize, and share project photos
 */
export default function ProjectPhotos() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);

  // Fetch projects
  const { data: projects } = trpc.projects.list.useQuery();

  // Fetch photos for selected project
  const { data: photos, refetch: refetchPhotos } = trpc.photos.byProject.useQuery(
    { projectId: selectedProject || 0 },
    { enabled: !!selectedProject }
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadingFiles((prev) => [...prev, ...files]);
  };

  const handleUpload = async () => {
    if (!selectedProject || uploadingFiles.length === 0) return;

    for (const file of uploadingFiles) {
      // In production, upload to S3 via backend
      console.log("Uploading:", file.name);
    }

    setUploadingFiles([]);
    refetchPhotos();
  };

  const handleDeletePhoto = async (photoId: number) => {
    if (confirm("Delete this photo?")) {
      // Call delete mutation
      refetchPhotos();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Project Photos</h1>
          <p className="text-gray-600">Upload and manage before/after photos for your projects</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Project Selection */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Projects</h2>
              <div className="space-y-2">
                {projects?.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProject(project.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedProject === project.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    <p className="font-medium truncate">{project.name}</p>
                    <p className="text-xs opacity-75">{project.status}</p>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedProject ? (
              <>
                {/* Upload Section */}
                <Card className="p-6 mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Photos</h2>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-gray-600 mb-4">
                      Drag and drop photos here or click to select
                    </p>
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label htmlFor="photo-upload">
                      <Button variant="outline" asChild>
                        <span>Select Photos</span>
                      </Button>
                    </label>
                  </div>

                  {/* Uploading Files Preview */}
                  {uploadingFiles.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Ready to upload ({uploadingFiles.length})
                      </p>
                      <div className="space-y-2">
                        {uploadingFiles.map((file, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                          >
                            <span className="text-sm text-gray-700 truncate">{file.name}</span>
                            <button
                              onClick={() =>
                                setUploadingFiles((prev) => prev.filter((_, i) => i !== idx))
                              }
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleUpload}
                    disabled={uploadingFiles.length === 0}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Upload {uploadingFiles.length} Photo{uploadingFiles.length !== 1 ? "s" : ""}
                  </Button>
                </Card>

                {/* Photos Gallery */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Photos ({photos?.length || 0})
                  </h2>

                  {photos && photos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {photos.map((photo: any) => (
                        <Card key={photo.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="aspect-square bg-gray-200 relative group">
                            <img
                              src={photo.url}
                              alt={photo.caption}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                className="flex items-center gap-2"
                              >
                                <Eye size={16} />
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeletePhoto(photo.id)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </div>
                          <div className="p-4">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {photo.caption || "Untitled"}
                            </p>
                            <p className="text-xs text-gray-600 mb-3">
                              {new Date(photo.uploadedAt).toLocaleDateString()}
                            </p>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 flex items-center justify-center gap-1"
                              >
                                <Download size={14} />
                                Download
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1">
                                Share
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="p-12 text-center">
                      <p className="text-gray-600">No photos yet. Upload your first photo!</p>
                    </Card>
                  )}
                </div>
              </>
            ) : (
              <Card className="p-12 text-center">
                <p className="text-gray-600 text-lg">Select a project to view and upload photos</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
