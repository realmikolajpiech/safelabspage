import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ValidationErrorProps {
  message: string;
  isVisible: boolean;
  onDismiss?: () => void;
}

const ValidationError: React.FC<ValidationErrorProps> = ({ message, isVisible, onDismiss }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ type: 'spring', damping: 15, stiffness: 300 }}
          className="bg-cyber-red/10 border border-cyber-red/50 rounded-lg p-4 flex items-start gap-3 group hover:border-cyber-red transition-colors"
        >
          <AlertTriangle className="w-5 h-5 text-cyber-red shrink-0 mt-0.5 animate-pulse" />
          <p className="text-cyber-red font-mono text-sm flex-1">{message}</p>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-gray-500 hover:text-cyber-red transition-colors ml-2 shrink-0 hover:scale-110"
              aria-label="Dismiss error"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ValidationError;
