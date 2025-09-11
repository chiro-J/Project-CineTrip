import { useState, useEffect, type SetStateAction } from "react";
import { Heart, MapPin, Share2, Trash2, X } from "lucide-react";
import { Button } from "../ui/Button";
import { Avatar } from "../ui/Avatar";

/**
 * 메인 컴포넌트
 * @param imageSrc -  클릭한 카드의 이미지
 * @param imageAlt -  클릭한 카드의 alt
 * @param authorName - 작성자 표시
 * @param locationLabel - 위치 텍스트
 * @param onClose - 닫기 핸들러
 */

type PostModalProps = {
  imageSrc: string;
  imageAlt?: string;
  authorName?: string;
  locationLabel?: string;
  onClose: () => void;
  isOpen: boolean;
};

const PostModal: React.FC<PostModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  imageAlt = "Post content",
  authorName = "Newbie",
  locationLabel = "Tower Bridge, London",
}) => {
  if (!isOpen) return null; // ✅ 닫혀 있으면 렌더 안함

  // (선택) ESC로 닫기 + 스크롤 잠금
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEsc);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  // 댓글 기능을 위한 상태 추가
  const [comments, setComments] = useState([
    { id: 1, author: "User1", text: "Wow, amazing picture!" },
    { id: 2, author: "User2", text: "Love this place." },
    { id: 3, author: "User3", text: "Great shot!" },
    { id: 4, author: "User4", text: "I want to go there too!" },
  ]);
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const INITIAL_COMMENT_COUNT = 2;

  // 이벤트 핸들러 함수

  const handleFollowClick = () => {
    setIsFollowing(!isFollowing);
  };

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    console.log("Like button clicked!");
  };

  const handleShareClick = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert("링크가 클립보드에 복사되었습니다!");
      })
      .catch((err) => {
        console.error("링크 복사 실패:", err);
        // execCommand는 오래된 방식이지만, https가 아닌 환경이나 iframe에서 clipboard API가 동작하지 않을 때를 위한 fallback입니다.
        const textArea = document.createElement("textarea");
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand("copy");
          alert("링크가 클립보드에 복사되었습니다! (fallback)");
        } catch (err) {
          console.error("Fallback copy failed", err);
          alert("링크 복사에 실패했습니다.");
        }
        document.body.removeChild(textArea);
      });
  };

  const handleDeleteClick = () => {
    // 실제 구현에서는 확인 모달을 띄우고 삭제 API를 호출합니다.
    if (confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      console.log("Post deleted!");
      // UI에서 게시물 제거 로직 추가
    }
  };

  const handleCommentChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments((prev) => [
      ...prev,
      { id: prev.length + 1, author: "Newbie", text: newComment.trim() },
    ]);
    setNewComment("");
  };
  const commentsToShow = showAllComments
    ? comments
    : comments.slice(0, INITIAL_COMMENT_COUNT);

  const handleToggleComments = () => {
    setShowAllComments(!showAllComments);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className="relative items-center z-[101] pl-2 pr-2 max-h-[90vh] overflow-auto no-scrollbar rounded-xl bg-white shadow-xl"
      >
        <div className="w-full max-w-md font-sans bg-white rounded-lg shadow-xl">
          {/* --- 헤더 --- */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Avatar size="sm" />
              <span className="font-semibold text-gray-800">Newbie</span>
            </div>
            <Button
              variant={isFollowing ? "secondary" : "primary"}
              size="sm"
              onClick={handleFollowClick}
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
          </div>

          {/* --- 이미지 --- */}

          <div className="flex items-center justify-center w-full bg-gray-200 aspect-square">
            <img
              src={imageSrc}
              alt={imageAlt}
              className="object-contain w-full h-full rounded-lg"
              onError={(e) => {
                e.currentTarget.src =
                  "https://placehold.co/600x600/f87171/ffffff?text=Error";
              }}
            />
          </div>
          {/* --- 액션 버튼 --- */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 pl-2">
              <button
                onClick={handleLikeClick}
                aria-label="Like post"
                className="p-3"
              >
                <Heart
                  className={`h-5 w-5 cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110 ${isLiked ? "text-red-500 fill-red-500" : "text-gray-700"}`}
                  strokeWidth={2}
                />
              </button>
              <button
                onClick={handleShareClick}
                aria-label="Share post"
                className="p-3"
              >
                <Share2
                  className="w-5 h-5 text-gray-700 transition-transform duration-200 ease-in-out cursor-pointer hover:scale-110"
                  strokeWidth={2}
                />
              </button>
            </div>
            <div className="pr-3">
              <button
                onClick={handleDeleteClick}
                className="p-3"
                aria-label="Delete post"
              >
                <Trash2
                  className="w-5 h-5 text-gray-700 transition-transform duration-200 ease-in-out cursor-pointer hover:scale-110"
                  strokeWidth={2}
                />
              </button>
            </div>
          </div>

          {/* --- 컨텐츠 --- */}
          <div className="px-4 pb-4 space-y-3 text-left border-t border-gray-200">
            <div className="flex items-center gap-2 pt-4">
              <MapPin className="flex-shrink-0 w-5 h-5 text-gray-500" />
              <p className="text-sm text-gray-600">Tower Bridge, London</p>
            </div>
            <p className="pt-2 text-gray-800 ">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </p>
            <p className="text-sm text-blue-600">
              #Spiderman: Far from Home #Marvel
            </p>
          </div>

          {/* --- 댓글 입력 --- */}
          <form
            onSubmit={handleCommentSubmit}
            className="flex items-center gap-2 p-4 border-t border-gray-200"
          >
            <textarea
              className="w-full p-2 text-sm border border-gray-200 rounded-md resize-none focus:ring-black focus:border-black"
              rows={1}
              placeholder="Comment..."
              value={newComment}
              onChange={handleCommentChange}
            ></textarea>
            <Button
              type="submit"
              size="sm"
              variant="ghost"
              disabled={!newComment.trim()}
            >
              Post
            </Button>
          </form>

          {/* --- 댓글 목록 --- */}
          <div className="pl-6 space-y-2">
            {commentsToShow.map((comment) => (
              <div key={comment.id} className="flex gap-2 text-sm">
                <span className="flex-shrink-0 font-semibold text-gray-800">
                  {comment.author}
                </span>
                <p className="text-gray-700 break-words">{comment.text}</p>
              </div>
            ))}
          </div>
          <div className="px-4 pt-4 pb-4 space-y-3">
            {comments.length > INITIAL_COMMENT_COUNT && (
              <button
                onClick={handleToggleComments}
                className="text-sm font-medium text-gray-500 hover:text-gray-800"
              >
                {showAllComments
                  ? "Hide comments"
                  : `View all ${comments.length} comments`}
              </button>
            )}
          </div>
          <style>{`
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  .no-scrollbar::-webkit-scrollbar { display: none; }
`}</style>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
