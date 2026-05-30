import { useState, useRef, useEffect } from 'react';
import { timeAgo } from '../lib/utils';

export default function InquirySection({ inquiries, onAddInquiry, onAddReply }) {
  const [message, setMessage] = useState('');
  const [author, setAuthor] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyMsg, setReplyMsg] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [inquiries]);

  const handleSubmitInquiry = (e) => {
    e.preventDefault();
    if (!message.trim() || !author.trim()) return;
    onAddInquiry({ author: author.trim(), message: message.trim() });
    setMessage('');
  };

  const handleSubmitReply = (inquiryId) => {
    if (!replyMsg.trim() || !author.trim()) return;
    onAddReply(inquiryId, { author: author.trim(), message: replyMsg.trim() });
    setReplyMsg('');
    setReplyTo(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm animate-slide-up">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        询问留言
        <span className="text-sm font-normal text-gray-400">({inquiries.length})</span>
      </h2>

      {/* Inquiry List */}
      {inquiries.length > 0 ? (
        <div className="space-y-3 mb-8 max-h-96 overflow-y-auto pr-1">
          {inquiries.map((inq) => (
            <div key={inq.id} className="p-4 bg-gray-50 rounded-xl min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-sm font-medium text-gray-700 shrink-0">{inq.author}</span>
                <span className="text-xs text-gray-400 shrink-0">{timeAgo(inq.time)}</span>
              </div>
              <p className="text-sm text-gray-600 mb-3 break-words overflow-wrap-anywhere">{inq.message}</p>

              {/* Replies */}
              {inq.replies && inq.replies.length > 0 && (
                <div className="space-y-2 mb-3 pl-4 border-l-2 border-gray-200">
                  {inq.replies.map((reply, i) => (
                    <div key={i} className="text-sm min-w-0">
                      <span className="font-medium text-gray-600">{reply.author}：</span>
                      <span className="text-gray-500 break-words">{reply.message}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Box */}
              {replyTo === inq.id ? (
                <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                  <input
                    value={replyMsg}
                    onChange={(e) => setReplyMsg(e.target.value)}
                    placeholder="回复内容..."
                    className="input-minimal flex-1 min-w-0 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmitReply(inq.id)}
                  />
                  <button
                    onClick={() => handleSubmitReply(inq.id)}
                    className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors cursor-pointer shrink-0"
                  >
                    回复
                  </button>
                  <button
                    onClick={() => { setReplyTo(null); setReplyMsg(''); }}
                    className="px-3 py-2 text-sm text-gray-400 hover:text-gray-600 cursor-pointer shrink-0"
                  >
                    取消
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setReplyTo(inq.id)}
                  className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  回复
                </button>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      ) : (
        <div className="text-center py-8 mb-6 text-gray-400 text-sm">
          暂无留言，来做第一个提问的人吧 👋
        </div>
      )}

      {/* New Inquiry Form */}
      <div className="border-t border-gray-100 pt-6">
        <div className="flex flex-wrap sm:flex-nowrap gap-2">
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="你的昵称"
            className="input-minimal px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm w-24 sm:w-32 shrink-0"
          />
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="有什么想问的？关于成色、价格、交易方式..."
            className="input-minimal flex-1 min-w-0 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmitInquiry(e)}
          />
          <button
            onClick={handleSubmitInquiry}
            disabled={!message.trim() || !author.trim()}
            className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
}
