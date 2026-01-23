import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import { getStoryById, getExternalStoryById, fetchExternalTextByUrl } from "../api/storyApi";
import { getChapterSidebar, getChapterContent } from "../api/chapterApi";

function Reader() {
  const { source, id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Internal
  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [chapterContent, setChapterContent] = useState("");

  // External
  const [externalBook, setExternalBook] = useState(null);
  const [externalText, setExternalText] = useState("");

  const isInternal = source === "internal";
  const isExternal = source === "external";

  const readerTitle = useMemo(() => {
    if (isInternal) return story?.title || "Story";
    return externalBook?.title || "Book";
  }, [isInternal, story?.title, externalBook?.title]);

  useEffect(() => {
    const loadReader = async () => {
      setLoading(true);
      setError("");

      try {
        // ✅ INTERNAL STORY FLOW
        if (isInternal) {
          const storyRes = await getStoryById(id);
          setStory(storyRes.data.story);

          const sidebarRes = await getChapterSidebar(id);
          const list = sidebarRes.data?.chapters || [];

          setChapters(list);

          if (list.length > 0) {
            const firstChapter = list[0];
            setSelectedChapterId(firstChapter._id);

            const chapterRes = await getChapterContent(firstChapter._id);
            setChapterContent(chapterRes.data?.chapter?.content || "");
          } else {
            setSelectedChapterId(null);
            setChapterContent("");
          }
        }

        // ✅ EXTERNAL STORY FLOW
        if (isExternal) {
          const bookRes = await getExternalStoryById(id);
          const book = bookRes.data;

          setExternalBook(book);

          // Prefer plain text
          const plain =
              book?.formats?.["text/plain; charset=utf-8"] ||
              book?.formats?.["text/plain"];

          const readableUrl = plain || null;


          if (!readableUrl) {
            setExternalText("");
            return;
          }

          const textRes = await fetchExternalTextByUrl(readableUrl);

          // show as raw text (safe)
          setExternalText(textRes.data || "");
        }
      } catch (err) {
        console.error(err);
        setError(err?.response?.data?.message || "Failed to load reader");
      } finally {
        setLoading(false);
      }
    };

    loadReader();
  }, [source, id]);

  // ✅ Chapter change (internal)
  const handleSelectChapter = async (chapterId) => {
    setSelectedChapterId(chapterId);
    setLoading(true);
    setError("");

    try {
      const chapterRes = await getChapterContent(chapterId);
      setChapterContent(chapterRes.data?.chapter?.content || "");
    } catch (err) {
      setError("Failed to load chapter");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <Navbar page="Reader" />

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {readerTitle}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {isInternal
                ? `Read chapters from StoryBuilder`
                : `Public domain book`}
            </p>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition text-gray-700 font-medium"
          >
            Back
          </button>
        </div>

        {/* Loading / Error */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 text-gray-600">
            Loading reader...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* ✅ Left sidebar (internal chapters) */}
            {isInternal && (
              <div className="lg:col-span-1">
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900">
                      Chapters
                    </p>
                  </div>

                  <div className="p-2 max-h-[70vh] overflow-auto">
                    {chapters.length === 0 ? (
                      <div className="p-3 text-sm text-gray-600">
                        No chapters available.
                      </div>
                    ) : (
                      chapters.map((ch) => {
                        const active = ch._id === selectedChapterId;
                        return (
                          <button
                            key={ch._id}
                            onClick={() => handleSelectChapter(ch._id)}
                            className={`w-full text-left px-3 py-2 rounded-xl text-sm transition mb-1 ${
                              active
                                ? "bg-gray-100 text-gray-900 border border-gray-200"
                                : "hover:bg-gray-50 text-gray-700"
                            }`}
                          >
                            {ch.title || "Untitled Chapter"}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ✅ Main reader body */}
            <div className={isInternal ? "lg:col-span-3" : "lg:col-span-4"}>
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-900">
                    {isInternal ? "Chapter Content" : "Book Content"}
                  </p>
                </div>

                <div className="p-5">
                  {/* Internal chapter content is HTML (Quill) */}
                  {isInternal && (
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: chapterContent || "<p>No content.</p>",
                      }}
                    />
                  )}

                  {/* External is raw text */}
                  {isExternal && (
                    <>
                      {externalText ? (
                        <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
                          {externalText}
                        </pre>
                      ) : (
                        <div className="text-gray-600 text-sm">
                          This book format is not directly readable here.
                          <div className="mt-3">
                            <a
                              href={externalBook?.formats?.["text/html"] || "#"}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-block px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition font-medium text-gray-700"
                            >
                              Read on Gutenberg
                            </a>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reader;
