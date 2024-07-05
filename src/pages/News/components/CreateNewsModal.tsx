import { useLayoutEffect, useState } from 'react';
import { Modal, Form, Input, Checkbox, notification } from 'antd';
import { CreateNewsPayload, NewsType } from '../../../types/News.type';
import { useMediaFiles } from '../../../hooks/useMediaFiles';
import { MediaDisplay } from '../../../components/media-display/MediaDisplay';
import { AddMedia } from '../../../components/add-media/AddMedia';

interface Values {
  [key: string]: string;
  title: string;
  type: string;
  shortDescription: string;
  fullDescription: string;
}

type Props = {
  open: boolean;
  handleOk: (payload: CreateNewsPayload) => Promise<string>;
  confirmLoading: boolean;
  handleCancel: () => void;
  handleUpdateNews: (payload: CreateNewsPayload) => void;
  currentUpdateNews: NewsType | null;
};

const { TextArea } = Input;

const CreateNewsModal = ({
  confirmLoading,
  handleCancel,
  handleOk,
  open,
  currentUpdateNews,
  handleUpdateNews,
}: Props) => {
  const [notApi, contextHolder] = notification.useNotification();
  const [values, setValues] = useState<Values>({
    title: '',
    type: 'news',
    shortDescription: '',
    fullDescription: '',
  });
  const [errors, setErrors] = useState({
    title: false,
    type: false,
    shortDescription: false,
    fullDescription: false,
  });
  const mediaPreview = useMediaFiles();



  const validValues = () => {
    let error = false;
    for (let field in values) {
      const currentValue = values[field];
      if (currentValue.length === 0) {
        setErrors((prev) => ({ ...prev, [field]: true }));
        error = true;
      }
    }

    if (error) {
      notApi.error({ message: 'Заполните все поля' });
    }
    
    return error;
  };

  const resetValues = () => {
    const resetInput = {
      type: values.type,
      title: '',
      fullDescription: '',
      shortDescription: '',
    };

    setErrors({
      type: false,
      fullDescription: false,
      shortDescription: false,
      title: false,
    });
    mediaPreview.cancelFiles();
    setValues(resetInput);
  };

  useLayoutEffect(() => {
    if (currentUpdateNews) {
      setValues(() => ({
        title: currentUpdateNews.title,
        type: currentUpdateNews.type,
        fullDescription: currentUpdateNews.fullDescription,
        shortDescription: currentUpdateNews.shortDescription,
      }));
      mediaPreview.fillMedia([
        `http://localhost:8080/uploads/${currentUpdateNews.image}`,
      ]);
    } else {
      resetValues();
    }
  }, [currentUpdateNews]);

  const onOk = () => {
    if (validValues()) return;

    const image =
      mediaPreview.fileList.length > 0 && mediaPreview.fileList[0].file
        ? mediaPreview.fileList[0].file
        : null;

    if (!image && !currentUpdateNews) {
      return notApi.error({ message: 'Выберите фото' });
    }

    const payload = {
      ...values,
      image,
    };

    if (currentUpdateNews) {
      handleUpdateNews(payload);
    } else {
      handleOk(payload).then((res) => res === 'create' && resetValues());
    }
  };

  const changeValues = (value: string, field: string) => {
    if (field === 'type') {
      setValues((prev) => ({
        ...prev,
        type: value !== 'news' ? 'promotion' : 'news',
      }));
      return;
    }
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const handleCloseModal = () => {
    resetValues();
    handleCancel();
  };

  return (
    <Modal
      title="Создание новости"
      open={open}
      onOk={onOk}
      confirmLoading={confirmLoading}
      onCancel={handleCloseModal}
      okText={currentUpdateNews ? 'Редактировать' : "Создать"}
      cancelText="Отмена"
    >
      {contextHolder}
      <Form.Item>
        <label style={{ paddingBottom: 10, paddingTop: 24 }}>
          Заголовок:
          <Input
            name="title"
            value={values.title}
            onChange={(e) => changeValues(e.target.value, 'title')}
            placeholder="Введите заголовок новости"
            style={{ borderColor: errors.title ? 'red' : '' }}
          />
        </label>
      </Form.Item>
      <Form.Item>
        <label style={{ paddingBottom: 10, paddingTop: 24 }}>
          Краткое описание:
          <Input
            name="shortDescription"
            value={values.shortDescription}
            onChange={(e) => changeValues(e.target.value, 'shortDescription')}
            placeholder="Введите краткое описание"
            style={{ borderColor: errors.shortDescription ? 'red' : '' }}
          />
        </label>
      </Form.Item>
      <Form.Item>
        <label style={{ paddingBottom: 10, paddingTop: 24 }}>
          Полное описание:
          <TextArea
            rows={4}
            name="fullDescription"
            value={values.fullDescription}
            onChange={(e) => changeValues(e.target.value, 'fullDescription')}
            placeholder="Введите полное описание"
            style={{ borderColor: errors.fullDescription ? 'red' : '' }}
          />
        </label>
      </Form.Item>
      <Form.Item>
        <Checkbox
          checked={values.type === 'news'}
          onChange={() => changeValues('news', 'type')}
        >
          Новости
        </Checkbox>
        <Checkbox
          checked={values.type === 'promotion'}
          onChange={() => changeValues('promotion', 'type')}
        >
          Продвижение
        </Checkbox>
      </Form.Item>
      <Form.Item style={{ marginTop: 24 }} name="fullDescription">
        {mediaPreview.fileList.length > 0 ? (
          <MediaDisplay
            size="lg"
            image={mediaPreview.fileList[0].result}
            editDisplay={() =>
              mediaPreview.handleEditFile(mediaPreview.fileList[0].id)
            }
            removeDisplay={() =>
              mediaPreview.removeFile(mediaPreview.fileList[0].id)
            }
          />
        ) : (
          <AddMedia
            changeFile={mediaPreview.changeFile}
            fileRef={mediaPreview.fileRef}
            description={'Добавить фото'}
            size="lg"
            accept=".jpg,.jpeg,.png,.gif"
          />
        )}
      </Form.Item>
    </Modal>
  );
};

export default CreateNewsModal;
