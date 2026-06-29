import { Modal, Form, Input, Select, Typography, Button, FormInstance } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { AudienceFormValues, DocumentType } from '../types';
import styles from '../ImpactTrailDashboard.module.scss';

interface AudienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: AudienceFormValues) => void;
  isCreating: boolean;
  form: FormInstance<AudienceFormValues>;
  documents: DocumentType[];
}

export const AudienceModal = ({
  isOpen,
  onClose,
  onSubmit,
  isCreating,
  form,
  documents
}: AudienceModalProps) => {
  return (
    <Modal 
      title="Create Audience" 
      open={isOpen} 
      onOk={() => form.submit()} 
      onCancel={onClose} 
      confirmLoading={isCreating} 
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="docIds" label="Linked Documents" rules={[{ required: true }]}>
          <Select 
            mode="multiple" 
            placeholder="Select documents"
            options={documents.map(d => ({ label: d.name, value: d.id }))}
          />
        </Form.Item>
        <Form.List name="vpcs">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className={styles.mockupBox}>
                  <Typography.Text strong>{key}</Typography.Text>
                  <Typography.Text type="secondary" className={styles.mockupHint}>Enter comma-separated values for the fields below:</Typography.Text>
                  <Form.Item {...restField} name={[name, 'name']} label="VPC Name" rules={[{ required: true }]}><Input /></Form.Item>
                  <Form.Item {...restField} name={[name, 'fields', 'jobs']} label="Jobs"><Input /></Form.Item>
                  <Form.Item {...restField} name={[name, 'fields', 'pains']} label="Pains"><Input /></Form.Item>
                  <Form.Item {...restField} name={[name, 'fields', 'gains']} label="Gains"><Input /></Form.Item>
                  <Form.Item {...restField} name={[name, 'fields', 'products']} label="Products"><Input /></Form.Item>
                  <Form.Item {...restField} name={[name, 'fields', 'painRelievers']} label="Pain Relievers"><Input /></Form.Item>
                  <Form.Item {...restField} name={[name, 'fields', 'gainCreators']} label="Gain Creators"><Input /></Form.Item>
                  <Button danger onClick={() => remove(name)} size="small">Remove VPC</Button>
                </div>
              ))}
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>Add VPC</Button>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};
