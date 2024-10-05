import Modal from "@/components/Modal";
import { useDeleteProjectMutation } from "@/state/api";
import { useRouter } from "next/navigation";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  id: string | null;
};

const ModalDeleteProject = ({ isOpen, onClose, id }: Props) => {
  const router = useRouter();

  const [deleteProject] = useDeleteProjectMutation();

  const handleSubmit = async () => {
    await deleteProject({ projectId: Number(id) });
    router.push("/");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Delete Project">
      <div>
        <p className="text-lg font-medium text-gray-900 dark:text-white">
          Are you sure you want to delete this project?
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
          This action cannot be undone.
        </p>
      </div>
      <div className="flex items-center justify-end mt-4 gap-3">
        <button
          className="focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-base font-medium text-gray-900 shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-dark-secondary dark:text-white"
          onClick={() => onClose()}
        >
          Cancel
        </button>
        <button
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-600`}
          onClick={handleSubmit}
        >
          Delete
        </button>
      </div>
    </Modal>
  );
};

export default ModalDeleteProject;
