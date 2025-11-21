"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const QuillEditor = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-slate-800 border border-slate-600 rounded-lg animate-pulse" />
  ),
});

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'font': [] }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['blockquote', 'code-block'],
    ['link'],
    ['clean']
  ],
};

const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'color',
  'background',
  'align',
  'list',
  'bullet',
  'blockquote',
  'code-block',
  'link'
];

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  // Using state to handle hydration mismatch
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Polyfill for findDOMNode to prevent the error
    if (typeof window !== 'undefined' && !window.ReactDOM?.findDOMNode) {
      const ReactDOM = require('react-dom');
      if (ReactDOM && !ReactDOM.findDOMNode) {
        ReactDOM.findDOMNode = (component: any) => {
          if (component?.nodeType === 1) {
            return component;
          }
          if (component?._reactInternalFiber?.stateNode) {
            return component._reactInternalFiber.stateNode;
          }
          if (component?._reactInternals?.stateNode) {
            return component._reactInternals.stateNode;
          }
          return null;
        };
      }
    }
  }, []);

  if (!mounted) {
    return (
      <div className="h-64 bg-slate-800 border border-slate-600 rounded-lg animate-pulse" />
    );
  }

  return (
    <div className="rich-text-editor">
      <style jsx global>{`
        .rich-text-editor .ql-toolbar.ql-snow {
          border-color: rgb(71, 85, 105) !important;
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          background-color: rgb(30, 41, 59);
        }
        
        .rich-text-editor .ql-container.ql-snow {
          border-color: rgb(71, 85, 105) !important;
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          background-color: rgb(30, 41, 59);
          min-height: 200px;
        }
        
        .rich-text-editor .ql-editor {
          min-height: 200px;
          color: rgb(226, 232, 240);
        }
        
        .rich-text-editor .ql-editor.ql-blank::before {
          color: rgb(148, 163, 184);
        }
        
        .rich-text-editor .ql-picker {
          color: rgb(226, 232, 240) !important;
        }
        
        .rich-text-editor .ql-stroke {
          stroke: rgb(226, 232, 240) !important;
        }
        
        .rich-text-editor .ql-fill {
          fill: rgb(226, 232, 240) !important;
        }
        
        .rich-text-editor .ql-picker-options {
          background-color: rgb(30, 41, 59) !important;
          border-color: rgb(71, 85, 105) !important;
        }
        
        .rich-text-editor .ql-tooltip {
          background-color: rgb(30, 41, 59) !important;
          border-color: rgb(71, 85, 105) !important;
          color: rgb(226, 232, 240) !important;
        }
        
        .rich-text-editor .ql-tooltip input[type=text] {
          background-color: rgb(51, 65, 85) !important;
          border-color: rgb(71, 85, 105) !important;
          color: rgb(226, 232, 240) !important;
        }
      `}</style>
      <QuillEditor
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
}
