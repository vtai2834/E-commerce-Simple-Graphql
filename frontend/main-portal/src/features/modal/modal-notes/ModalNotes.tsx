import type React from "react"
import { Modal, Typography } from "antd"
import "./style.scss"

const { Text } = Typography

interface NotesModalProps {
  visible: boolean
  onClose: () => void
  notes: string
}

const ModalNotes: React.FC<NotesModalProps> = ({ visible, onClose, notes }) => {
  return (
    <Modal
      title="Patient Notes"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
      className="notes-modal"
    >
      <div className="notes-modal__content">
        <Text className="notes-modal__text">{notes}</Text>
      </div>
    </Modal>
  )
}

export default ModalNotes
