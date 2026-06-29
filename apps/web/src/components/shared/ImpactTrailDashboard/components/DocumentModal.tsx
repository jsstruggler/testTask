import { Modal, Form, Input, Select, FormInstance } from 'antd';
import { DocumentFormValues } from '../types';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: DocumentFormValues) => void;
  isCreating: boolean;
  form: FormInstance<DocumentFormValues>;
}

export const DocumentModal = ({
  isOpen,
  onClose,
  onSubmit,
  isCreating,
  form
}: DocumentModalProps) => {
  return (
    <Modal 
      title="Create Document" 
      open={isOpen} 
      onOk={() => form.submit()} 
      onCancel={onClose} 
      confirmLoading={isCreating}
    >
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={onSubmit} 
        initialValues={{ type: 'audience' }}
      >
        <Form.Item name="name" label="Document Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="type" label="Document Type" rules={[{ required: true }]}>
          <Select
            options={[
              { value: 'audience', label: 'Audience' },
              { value: 'product', label: 'Product' }
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
