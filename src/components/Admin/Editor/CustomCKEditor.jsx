import { useState, useEffect, useRef, useMemo } from 'react';
import { CKEditor, useCKEditorCloud } from '@ckeditor/ckeditor5-react';

import './CustomCKEditor.css';

const LICENSE_KEY =
   'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NDQyNDMxOTksImp0aSI6IjViYjI1ZjkwLWQ2NjktNDQxYy05ODk0LTAzZTUxOGMyMzllOCIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjIyNDdjNzQ4In0.tZZ7uySjCyEfehM_cqFnZwzSGgV0hD7jFDgCs64dUWS1ZLcpjn-75wQJQDi8ChsFe63ZQje36RMSvYjvdGOjpg';

export default function CustomCKEditor({ value, onChange }) {
   const editorContainerRef = useRef(null);
   const editorRef = useRef(null);
   const editorWordCountRef = useRef(null);
   const [isLayoutReady, setIsLayoutReady] = useState(false);
   const cloud = useCKEditorCloud({ version: '44.3.0', translations: ['vi'] });
   // Hàm lấy token từ localStorage
   const getToken = () => localStorage.getItem('jwt');
   const token = getToken();
   useEffect(() => {
      setIsLayoutReady(true);

      return () => setIsLayoutReady(false);
   }, []);

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
         // Base64UploadAdapter,
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
               // Base64UploadAdapter,
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
               uploadUrl: 'https://localhost:5001/api/files/upload-editor', // Địa chỉ API backend của bạn
               withCredentials: true,
               headers: {
                  Authorization: token ? `Bearer ${token}` : '', // Thêm token nếu cần authentication
               },
            },
            initialData: value || '',
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
            // placeholder: 'Type or paste your content here!',
            table: {
               contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties'],
            },
         },
      };
   }, [cloud, value]);

   return (
      <div className="main-container-ckeditor">
         <div
            className="editor-container editor-container_classic-editor editor-container_include-word-count"
            ref={editorContainerRef}
         >
            <div className="editor-container__editor">
               <div ref={editorRef}>
                  {ClassicEditor && editorConfig && (
                     <CKEditor
                        editor={ClassicEditor}
                        config={editorConfig}
                        data={value}
                        onChange={(event, editor) => onChange(editor.getData())}
                        onReady={(editor) => {
                           const wordCount = editor.plugins.get('WordCount');
                           editorWordCountRef.current.appendChild(wordCount.wordCountContainer);
                        }}
                        onAfterDestroy={() => {
                           Array.from(editorWordCountRef.current.children).forEach((child) => child.remove());
                        }}
                     />
                  )}
               </div>
            </div>
            <div className="editor_container__word-count" ref={editorWordCountRef}></div>
         </div>
      </div>
   );
}
