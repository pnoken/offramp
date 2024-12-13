import React, { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

interface RatingPopupProps {
  isOpen: boolean;
  onSubmit: (rating: number, feedback: string) => void;
  onClose: () => void;
}

const RatingPopup: React.FC<RatingPopupProps> = ({
  isOpen,
  onSubmit,
  onClose,
}) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    onSubmit(rating, feedback);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-sm rounded bg-white p-6">
          <DialogTitle className="text-lg font-medium">
            Rate your experience
          </DialogTitle>
          {/* Add star rating component here */}
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Your feedback"
            className="w-full mt-2 p-2 border rounded"
          />
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Submit
            </button>
            <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
              Close
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default RatingPopup;
