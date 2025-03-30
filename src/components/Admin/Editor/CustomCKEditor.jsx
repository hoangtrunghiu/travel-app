import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { CKEditor, useCKEditorCloud } from '@ckeditor/ckeditor5-react';

import './CustomCKEditor.css';

const LICENSE_KEY =
   'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NDQyNDMxOTksImp0aSI6IjViYjI1ZjkwLWQ2NjktNDQxYy05ODk0LTAzZTUxOGMyMzllOCIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjIyNDdjNzQ4In0.tZZ7uySjCyEfehM_cqFnZwzSGgV0hD7jFDgCs64dUWS1ZLcpjn-75wQJQDi8ChsFe63ZQje36RMSvYjvdGOjpg';

export default function CustomCKEditor({ value, onChange }) {
   const editorContainerRef = useRef(null);
   const editorRef = useRef(null);
   const editorWordCountRef = useRef(null);
   const wordCountChildrenRef = useRef([]);
   const editorInstanceRef = useRef(null);
   const [isLayoutReady, setIsLayoutReady] = useState(false);
   const [initialValue] = useState(value || ''); // Store initial value only once
   const cloud = useCKEditorCloud({ version: '44.3.0', translations: ['vi'] });

   // Hàm lấy token từ localStorage - chỉ gọi một lần để tránh re-render
   const token = useMemo(() => localStorage.getItem('jwt'), []);

   // Sử dụng useCallback để không tạo ra hàm mới mỗi lần render
   const handleEditorChange = useCallback(
      (event, editor) => {
         // Chỉ gọi onChange khi nội dung thực sự thay đổi
         const data = editor.getData();
         onChange(data);
      },
      [onChange],
   );

   // Sử dụng useCallback cho onReady để tránh tạo lại hàm mỗi lần render
   const handleEditorReady = useCallback((editor) => {
      editorInstanceRef.current = editor;
      try {
         if (editor && editor.plugins && editorWordCountRef.current) {
            const wordCount = editor.plugins.get('WordCount');
            if (wordCount && wordCount.wordCountContainer) {
               editorWordCountRef.current.appendChild(wordCount.wordCountContainer);
               // Store reference to the child element
               wordCountChildrenRef.current.push(wordCount.wordCountContainer);
            }
         }
      } catch (error) {
         console.error('Error setting up word count:', error);
      }
   }, []);

   // Fix: Move state update to useEffect to prevent updates on unmounted component
   useEffect(() => {
      // Only set layout ready after component is mounted
      const timeout = setTimeout(() => {
         setIsLayoutReady(true);
      }, 0);

      return () => {
         clearTimeout(timeout);
         setIsLayoutReady(false);

         // Clean up word count children on unmount
         if (wordCountChildrenRef.current.length && editorWordCountRef.current) {
            wordCountChildrenRef.current.forEach((child) => {
               if (editorWordCountRef.current && editorWordCountRef.current.contains(child)) {
                  editorWordCountRef.current.removeChild(child);
               }
            });
         }
         wordCountChildrenRef.current = [];
      };
   }, []);

   // Cập nhật giá trị từ bên ngoài vào editor mà không gây ra re-render
   useEffect(() => {
      if (editorInstanceRef.current && value !== undefined && value !== editorInstanceRef.current.getData()) {
         editorInstanceRef.current.setData(value);
      }
   }, [value]);

   const { ClassicEditor, editorConfig } = useMemo(() => {
      if (cloud.status !== 'success' || !isLayoutReady) {
         return {};
      }

      const {
         ClassicEditor,
         Alignment,
         Autoformat,
         AutoImage,
         AutoLink,
         Autosave,
         BlockQuote,
         Bold,
         CodeBlock,
         Essentials,
         FindAndReplace,
         FontBackgroundColor,
         FontColor,
         FontFamily,
         FontSize,
         GeneralHtmlSupport,
         Heading,
         HorizontalLine,
         ImageBlock,
         ImageCaption,
         ImageInline,
         ImageInsert,
         ImageInsertViaUrl,
         ImageResize,
         ImageStyle,
         ImageTextAlternative,
         ImageToolbar,
         ImageUpload,
         Indent,
         IndentBlock,
         Italic,
         Link,
         LinkImage,
         List,
         Paragraph,
         PasteFromMarkdownExperimental,
         SimpleUploadAdapter,
         SourceEditing,
         Table,
         TableCaption,
         TableCellProperties,
         TableColumnResize,
         TableProperties,
         TableToolbar,
         Underline,
         WordCount,
      } = cloud.CKEditor;

      return {
         ClassicEditor,
         editorConfig: {
            toolbar: {
               items: [
                  'findAndReplace',
                  '|',
                  'heading',
                  '|',
                  'bold',
                  'italic',
                  'underline',
                  '|',
                  'fontSize',
                  'fontFamily',
                  'fontColor',
                  'fontBackgroundColor',
                  '|',
                  'horizontalLine',
                  'link',
                  'insertImage',
                  'insertTable',
                  'blockQuote',
                  '|',
                  'alignment',
                  '|',
                  'bulletedList',
                  'numberedList',
                  'outdent',
                  'indent',
                  'codeBlock',
                  'sourceEditing',
               ],
               shouldNotGroupWhenFull: false,
            },
            plugins: [
               Alignment,
               Autoformat,
               AutoImage,
               AutoLink,
               Autosave,
               BlockQuote,
               Bold,
               CodeBlock,
               Essentials,
               FindAndReplace,
               FontBackgroundColor,
               FontColor,
               FontFamily,
               FontSize,
               GeneralHtmlSupport,
               Heading,
               HorizontalLine,
               ImageBlock,
               ImageCaption,
               ImageInline,
               ImageInsert,
               ImageInsertViaUrl,
               ImageResize,
               ImageStyle,
               ImageTextAlternative,
               ImageToolbar,
               ImageUpload,
               Indent,
               IndentBlock,
               Italic,
               Link,
               LinkImage,
               List,
               Paragraph,
               PasteFromMarkdownExperimental,
               SimpleUploadAdapter,
               SourceEditing,
               Table,
               TableCaption,
               TableCellProperties,
               TableColumnResize,
               TableProperties,
               TableToolbar,
               Underline,
               WordCount,
            ],
            fontFamily: {
               supportAllValues: true,
            },
            fontSize: {
               options: [10, 12, 14, 'default', 18, 20, 22],
               supportAllValues: true,
            },
            heading: {
               options: [
                  {
                     model: 'paragraph',
                     title: 'Paragraph',
                     class: 'ck-heading_paragraph',
                  },
                  {
                     model: 'heading1',
                     view: 'h1',
                     title: 'Heading 1',
                     class: 'ck-heading_heading1',
                  },
                  {
                     model: 'heading2',
                     view: 'h2',
                     title: 'Heading 2',
                     class: 'ck-heading_heading2',
                  },
                  {
                     model: 'heading3',
                     view: 'h3',
                     title: 'Heading 3',
                     class: 'ck-heading_heading3',
                  },
                  {
                     model: 'heading4',
                     view: 'h4',
                     title: 'Heading 4',
                     class: 'ck-heading_heading4',
                  },
                  {
                     model: 'heading5',
                     view: 'h5',
                     title: 'Heading 5',
                     class: 'ck-heading_heading5',
                  },
                  {
                     model: 'heading6',
                     view: 'h6',
                     title: 'Heading 6',
                     class: 'ck-heading_heading6',
                  },
               ],
            },
            htmlSupport: {
               allow: [
                  {
                     name: /^.*$/,
                     styles: true,
                     attributes: true,
                     classes: true,
                  },
               ],
            },
            image: {
               toolbar: [
                  'toggleImageCaption',
                  'imageTextAlternative',
                  '|',
                  'imageStyle:inline',
                  'imageStyle:wrapText',
                  'imageStyle:breakText',
                  '|',
                  'resizeImage',
               ],
               upload: {
                  types: ['jpeg', 'png', 'gif', 'bmp', 'webp'],
               },
            },
            simpleUpload: {
               uploadUrl: 'https://localhost:5001/api/files/upload-editor',
               withCredentials: true,
               headers: {
                  Authorization: token ? `Bearer ${token}` : '',
               },
            },
            initialData: initialValue, // Sử dụng state value ban đầu thay vì prop value để tránh re-render
            licenseKey: LICENSE_KEY,
            link: {
               addTargetToExternalLinks: true,
               defaultProtocol: 'https://',
               decorators: {
                  toggleDownloadable: {
                     mode: 'manual',
                     label: 'Downloadable',
                     attributes: {
                        download: 'file',
                     },
                  },
               },
            },
            table: {
               contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties'],
            },
         },
      };
   }, [cloud, isLayoutReady, initialValue, token]);

   // Sử dụng useMemo cho việc render component để tránh re-render không cần thiết
   const editorComponent = useMemo(() => {
      if (!ClassicEditor || !editorConfig || !isLayoutReady) {
         return null;
      }

      return (
         <CKEditor
            editor={ClassicEditor}
            config={editorConfig}
            data={initialValue}
            onChange={handleEditorChange}
            onReady={handleEditorReady}
         />
      );
   }, [ClassicEditor, editorConfig, isLayoutReady, initialValue, handleEditorChange, handleEditorReady]);

   return (
      <div className="main-container-ckeditor">
         <div
            className="editor-container editor-container_classic-editor editor-container_include-word-count"
            ref={editorContainerRef}
         >
            <div className="editor-container__editor">
               <div ref={editorRef}>{editorComponent}</div>
            </div>
            <div className="editor_container__word-count" ref={editorWordCountRef}></div>
         </div>
      </div>
   );
}
