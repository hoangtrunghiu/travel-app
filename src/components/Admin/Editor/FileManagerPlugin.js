import React from 'react';
import ReactDOM from 'react-dom';

export function createFileManagerPlugin(FileManagerModal, onFileSelect) {
   return class FileManagerPlugin {
      constructor(editor) {
         this.editor = editor;
      }

      static get pluginName() {
         return 'FileManagerPlugin';
      }

      init() {
         const editor = this.editor;

         editor.ui.componentFactory.add('fileManager', () => {
            // Sử dụng ButtonView từ CKEditor
            const Button = this.editor.ui.componentFactory.create('button');

            Button.set({
               label: 'File Manager',
               icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/></svg>',
               tooltip: true,
            });

            Button.on('execute', () => {
               const modalContainer = document.createElement('div');
               document.body.appendChild(modalContainer);

               ReactDOM.render(
                  <FileManagerModal
                     isOpen={true}
                     onClose={() => {
                        ReactDOM.unmountComponentAtNode(modalContainer);
                        document.body.removeChild(modalContainer);
                     }}
                     onInsertFile={(file) => {
                        // Chèn ảnh vào editor
                        const imageUrl = process.env.REACT_APP_TRAVEL_BASE_URL_ROOT + file.url;
                        editor.model.change((writer) => {
                           const imageElement = writer.createElement('image', {
                              src: imageUrl,
                           });
                           editor.model.insertContent(imageElement);
                        });

                        // Gọi callback nếu được cung cấp
                        if (onFileSelect) {
                           onFileSelect(file);
                        }

                        // Đóng modal
                        ReactDOM.unmountComponentAtNode(modalContainer);
                        document.body.removeChild(modalContainer);
                     }}
                  />,
                  modalContainer,
               );
            });

            return Button;
         });
      }
   };
}
