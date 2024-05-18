import React from "react";

const ConfirmationModal = ({ questionId, onDelete, onClose }) => {
  const handleConfirm = () => {
    onDelete(questionId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg">
        <p className="text-lg font-semibold">
          Are you sure you want to delete this question?
        </p>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="mr-4 px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
