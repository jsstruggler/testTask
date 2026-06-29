import { Modal, Form, Input, Select, Button, FormInstance } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageFormValues, AudienceType } from '../types';
import styles from '../ImpactTrailDashboard.module.scss';

interface PageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: PageFormValues) => void;
  isCreating: boolean;
  form: FormInstance<PageFormValues>;
  audiences: AudienceType[];
}

export const PageModal = ({
  isOpen,
  onClose,
  onSubmit,
  isCreating,
  form,
  audiences
}: PageModalProps) => {
  return (
    <Modal 
      title="Create Page" 
      open={isOpen} 
      onOk={() => form.submit()} 
      onCancel={onClose} 
      confirmLoading={isCreating} 
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="audienceIds" label="Target Audiences" rules={[{ required: true }]}>
          <Select 
            mode="multiple" 
            placeholder="Select audiences"
            options={audiences.map(a => ({ label: a.name, value: a.id }))}
          />
        </Form.Item>
        <Form.List name="sections">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className={styles.mockupBox}>
                  <Form.Item {...restField} name={[name, 'name']} label="Section Name" rules={[{ required: true }]}><Input /></Form.Item>
                  <Form.Item {...restField} name={[name, 'vpcIds']} label="Linked VPCs" rules={[{ required: true }]}>
                    <Select 
                      mode="multiple" 
                      placeholder="Select related VPCs"
                      options={audiences.flatMap(a => a.vpcs || []).map(v => ({ label: v.name, value: v.id }))}
                    />
                  </Form.Item>
                  <Button danger onClick={() => remove(name)} size="small">Remove Section</Button>
                </div>
              ))}
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>Add Section</Button>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};
