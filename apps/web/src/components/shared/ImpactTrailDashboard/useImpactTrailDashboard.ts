import { useState, useMemo, MouseEvent } from 'react';
import { message, Form } from 'antd';
import { 
  useGetDocumentsQuery, 
  useGetAudiencesQuery, 
  useGetPagesQuery,
  useDeleteDocumentMutation,
  useCreateDocumentMutation,
  useCreateAudienceMutation,
  useCreatePageMutation
} from '@/store/api';
import { 
  SelectedNode, 
  DocumentFormValues, 
  AudienceFormValues, 
  PageFormValues 
} from './types';

export const useImpactTrailDashboard = () => {
  const { data: documents = [], isLoading: isLoadingDocs } = useGetDocumentsQuery();
  const { data: audiences = [], isLoading: isLoadingAuds } = useGetAudiencesQuery();
  const { data: pages = [], isLoading: isLoadingPages } = useGetPagesQuery();
  
  const [deleteDocument, { isLoading: isDeleting }] = useDeleteDocumentMutation();
  const [createDocument, { isLoading: isCreatingDoc }] = useCreateDocumentMutation();
  const [createAudience, { isLoading: isCreatingAud }] = useCreateAudienceMutation();
  const [createPage, { isLoading: isCreatingPage }] = useCreatePageMutation();

  const [selectedNode, setSelectedNode] = useState<SelectedNode | null>(null);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isAudModalOpen, setIsAudModalOpen] = useState(false);
  const [isPageModalOpen, setIsPageModalOpen] = useState(false);
  const [docForm] = Form.useForm<DocumentFormValues>();
  const [audForm] = Form.useForm<AudienceFormValues>();
  const [pageForm] = Form.useForm<PageFormValues>();

  const isLoading = isLoadingDocs || isLoadingAuds || isLoadingPages;


  const { highlightedDocs, highlightedAudiences, highlightedPages } = useMemo(() => {
    const docs = new Set<string>();
    const auds = new Set<string>();
    const pgs = new Set<string>();

    if (!selectedNode) {
      return { highlightedDocs: docs, highlightedAudiences: auds, highlightedPages: pgs };
    }

    if (selectedNode.type === 'document') {
      docs.add(selectedNode.id);
      audiences.forEach(a => {
        if (a.docIds?.includes(selectedNode.id)) {
          auds.add(a.id);
        }
      });
      pages.forEach(p => {
        if (p.audienceIds?.some(aid => auds.has(aid))) {
          pgs.add(p.id);
        }
      });
    } else if (selectedNode.type === 'audience') {
      auds.add(selectedNode.id);
      const targetAud = audiences.find(a => a.id === selectedNode.id);
      targetAud?.docIds?.forEach(did => docs.add(did));
      pages.forEach(p => {
        if (p.audienceIds?.includes(selectedNode.id)) {
          pgs.add(p.id);
        }
      });
    } else if (selectedNode.type === 'page') {
      pgs.add(selectedNode.id);
      const targetPage = pages.find(p => p.id === selectedNode.id);
      targetPage?.audienceIds?.forEach(aid => {
        auds.add(aid);
      });
      audiences.forEach(a => {
        if (auds.has(a.id)) {
          a.docIds?.forEach(did => docs.add(did));
        }
      });
    }

    return { highlightedDocs: docs, highlightedAudiences: auds, highlightedPages: pgs };
  }, [selectedNode, documents, audiences, pages]);

  const handleCreateDocument = async (values: DocumentFormValues) => {
    try {
      await createDocument(values).unwrap();
      message.success('Document created successfully');
      setIsDocModalOpen(false);
      docForm.resetFields();
    } catch (error) {
      message.error('Failed to create document');
    }
  };

  const handleCreateAudience = async (values: AudienceFormValues) => {
    try {
      const formattedVpcs = (values.vpcs || []).map(vpc => {
        const parseList = (str: string | undefined) => (str ? str.split(',').map(s => s.trim()).filter(Boolean) : []);
        return {
          ...vpc,
          fields: {
            jobs: parseList(vpc.fields?.jobs),
            pains: parseList(vpc.fields?.pains),
            gains: parseList(vpc.fields?.gains),
            products: parseList(vpc.fields?.products),
            painRelievers: parseList(vpc.fields?.painRelievers),
            gainCreators: parseList(vpc.fields?.gainCreators),
          }
        };
      });

      await createAudience({ ...values, vpcs: formattedVpcs }).unwrap();
      message.success('Audience created successfully');
      setIsAudModalOpen(false);
      audForm.resetFields();
    } catch (error) {
      message.error('Failed to create audience');
    }
  };

  const handleCreatePage = async (values: PageFormValues) => {
    try {
      await createPage({ ...values, sections: values.sections || [] }).unwrap();
      message.success('Page created successfully');
      setIsPageModalOpen(false);
      pageForm.resetFields();
    } catch (error) {
      message.error('Failed to create page');
    }
  };

  const handleDeleteDoc = async (id: string, e?: MouseEvent<HTMLElement>) => {
    e?.stopPropagation();
    try {
      await deleteDocument(id).unwrap();
      message.success('Document deleted successfully');
      if (selectedNode?.id === id) {
        setSelectedNode(null);
      }
    } catch (error) {
      message.error('Failed to delete document');
    }
  };

  return {
    documents,
    audiences,
    pages,
    isLoading,
    isDeleting,
    isCreatingDoc,
    isCreatingAud,
    isCreatingPage,
    selectedNode,
    setSelectedNode,
    isDocModalOpen,
    setIsDocModalOpen,
    isAudModalOpen,
    setIsAudModalOpen,
    isPageModalOpen,
    setIsPageModalOpen,
    docForm,
    audForm,
    pageForm,
    highlightedDocs,
    highlightedAudiences,
    highlightedPages,
    handleCreateDocument,
    handleCreateAudience,
    handleCreatePage,
    handleDeleteDoc,
  };
};
