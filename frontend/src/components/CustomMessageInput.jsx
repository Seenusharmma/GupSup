import { useMessageInputContext } from "stream-chat-react";
import { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import { Smile, Plus, Send } from "lucide-react";

const CustomMessageInput = ({ quotedMessage, clearQuotedMessage }) => {
  const { text, handleChange, handleSubmit, uploadNewFiles, attachments, removeAttachment } = useMessageInputContext();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const fileInputRef = useRef(null);
  const sendButtonRef = useRef(null);
  const textareaRef = useRef(null);
  const inputZoneRef = useRef(null);

  // Close emoji picker when clicking outside the entire input component
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If picker is hidden, do nothing
      if (!showEmojiPicker) return;

      // Check if click is inside the input component or the picker
      const isInsideInput = inputZoneRef.current && inputZoneRef.current.contains(event.target);
      const isInsidePicker = emojiPickerRef.current && emojiPickerRef.current.contains(event.target);
      const isInsidePickerReact = event.target.closest('.emoji-picker-react');

      if (!isInsideInput && !isInsidePicker && !isInsidePickerReact) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  const onEmojiClick = (emojiData, event) => {
    // Prevent this click from triggering handleClickOutside
    if (event) {
      if (typeof event.stopPropagation === 'function') event.stopPropagation();
      if (typeof event.preventDefault === 'function') event.preventDefault();
    }

    const emoji = emojiData.emoji;
    const currentText = text || "";
    
    let newText;
    let newCursorPos;

    if (textareaRef.current) {
        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        
        newText = currentText.substring(0, start) + emoji + currentText.substring(end);
        newCursorPos = start + emoji.length;
        
        // Update Stream context using the standard handleChange
        // We pass a synthetic event that Stream's handler expects
        handleChange({ target: { value: newText } });

        // Restore focus and cursor position after React update
        // Using a slightly longer timeout for cross-device stability
        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
            }
        }, 50);
    } else {
        newText = currentText + emoji;
        handleChange({ target: { value: newText } });
    }
  };

  const toggleEmojiPicker = (e) => {
    if (e) {
        e.stopPropagation();
        e.preventDefault();
    }
    const willShow = !showEmojiPicker;
    setShowEmojiPicker(willShow);
    
    // Auto-focus textarea when opening picker or interacting
    if (textareaRef.current) {
        textareaRef.current.focus();
    }
  };

  const handleContainerClick = () => {
    if (textareaRef.current) {
        textareaRef.current.focus();
    }
  };

  const handleSend = (e) => {
      if (e) e.preventDefault();
      // Ensure we submit the current state
      handleSubmit(e);
      setShowEmojiPicker(false);
      
      // Focus back to input after sending
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
  };

  const handleFileSelect = (e) => {
      if (e.target.files && e.target.files.length > 0) {
          uploadNewFiles(e.target.files);
      }
      e.target.value = '';
  };

  const hasContent = text.trim().length > 0 || (attachments && attachments.length > 0) || quotedMessage;

  return (
    <div ref={inputZoneRef} className="flex flex-col w-full relative">
      <input 
          type="file" 
          multiple 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileSelect} 
      />

      {/* Attachment Previews */}
      {attachments && attachments.length > 0 && (
          <div className="flex gap-2 p-2 overflow-x-auto bg-[#f0f2f5] border-t border-[#d1d7db]">
              {attachments.map((file, i) => (
                  <div key={i} className="relative shrink-0 w-20 h-20 bg-gray-200 rounded-md overflow-hidden border border-gray-300">
                      {file.type?.startsWith('image/') ? (
                          <img src={URL.createObjectURL(file.file)} alt="preview" className="w-full h-full object-cover" />
                      ) : (
                          <div className="flex items-center justify-center w-full h-full text-xs text-gray-500 p-1 text-center break-words">
                              {file.file?.name}
                          </div>
                      )}
                      <button 
                          onClick={() => removeAttachment(file.id)}
                          className="absolute top-0.5 right-0.5 bg-black/50 text-white rounded-full p-0.5 hover:bg-black/70"
                      >
                         <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                  </div>
              ))}
          </div>
      )}

      <div className="flex items-end gap-1 md:gap-2 p-2 md:p-3 bg-[#f0f2f5] border-t border-[#d1d7db] relative">
          {/* Emoji Picker Popup */}
          {showEmojiPicker && (
            <div ref={emojiPickerRef} className="absolute bottom-[70px] left-0 z-[100] shadow-2xl rounded-xl">
               <EmojiPicker 
                    onEmojiClick={onEmojiClick} 
                    theme="auto"
                    width={300}
                    height={400}
               />
            </div>
          )}

          <div className="flex gap-1 shrink-0 pb-1.5 md:pb-2">
            <button 
                className={`p-2 rounded-full hover:bg-gray-200 transition-all duration-200 active:scale-95 emoji-btn-toggle ${showEmojiPicker ? 'bg-gray-200' : ''}`}
                onClick={toggleEmojiPicker}
                type="button"
                title="Emoji"
            >
                <Smile className={`w-6 h-6 ${showEmojiPicker ? 'text-teal-600' : 'text-[#54656f]'}`} />
            </button>
            
            <button 
                className="p-2 rounded-full hover:bg-gray-200 transition-all duration-200 active:scale-95"
                onClick={() => fileInputRef.current?.click()}
                type="button"
            >
                <Plus className="w-6 h-6 text-[#54656f]" />
            </button>
          </div>

          <div 
             onClick={handleContainerClick}
             className="flex-1 bg-white rounded-2xl md:rounded-3xl px-4 py-2 shadow-sm border border-transparent focus-within:border-teal-500 transition-all min-h-[45px] flex items-center cursor-text"
          >
             <textarea 
                ref={textareaRef}
                value={text}
                onChange={handleChange}
                placeholder="Type a message"
                className="w-full max-h-[100px] bg-transparent outline-none resize-none text-[15px] text-[#111b21] custom-scrollbar placeholder:text-gray-500"
                rows={1}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (hasContent) handleSend(e);
                    }
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                }}
             />
          </div>

           {/* Send Button */}
           {hasContent ? ( 
               <button 
                  ref={sendButtonRef}
                  onClick={handleSend}
                  className="p-3 rounded-full bg-[#00a884] hover:bg-[#008f6f] shadow-md flex items-center justify-center transition-all duration-200 active:scale-95 enter-animation"
                  type="button"
                >
                  <Send className="w-5 h-5 text-white ml-0.5" />
               </button>
           ) : (
                 <button 
                  ref={sendButtonRef}
                  className="p-3 rounded-full bg-[#f0f2f5] text-[#54656f] hover:bg-gray-200 shadow-none flex items-center justify-center transition-all duration-200 cursor-default"
                  disabled
                  type="button"
                >
                  <Send className="w-5 h-5 opacity-50" />
               </button>
           )}
      </div>
    </div>
  );
};

export default CustomMessageInput;
