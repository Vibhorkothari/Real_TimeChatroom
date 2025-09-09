import React, { useState } from 'react';
import { FiBold, FiItalic, FiCode, FiType, FiUnderline } from 'react-icons/fi';
import { formattingActions } from '../../utils/textFormatting';
import './FormattingToolbar.css';

const FormattingToolbar = ({ onFormat, selectionStart, selectionEnd, text }) => {
  const [activeFormat, setActiveFormat] = useState(null);

  const handleFormat = (formatType) => {
    onFormat(formatType);
    setActiveFormat(formatType);
    
    // Reset active format after a short delay
    setTimeout(() => setActiveFormat(null), 200);
  };

  const getIcon = (formatType) => {
    switch (formatType) {
      case 'bold':
        return <FiBold />;
      case 'italic':
        return <FiItalic />;
      case 'code':
        return <FiCode />;
      case 'strikethrough':
        return <FiType />;
      case 'underline':
        return <FiUnderline />;
      default:
        return null;
    }
  };

  const hasSelection = selectionStart !== selectionEnd;

  return (
    <div className="formatting-toolbar">
      <div className="toolbar-title">Formatting</div>
      <div className="toolbar-actions">
        {formattingActions.map((action) => (
          <button
            key={action.id}
            className={`format-button ${activeFormat === action.id ? 'active' : ''} ${!hasSelection ? 'disabled' : ''}`}
            onClick={() => hasSelection && handleFormat(action.id)}
            title={`${action.description} (${action.markdown})`}
            disabled={!hasSelection}
          >
            {getIcon(action.id)}
            <span className="format-label">{action.symbol}</span>
          </button>
        ))}
      </div>
      
      {!hasSelection && (
        <div className="toolbar-hint">
          Select text to format
        </div>
      )}
    </div>
  );
};

export default FormattingToolbar;
