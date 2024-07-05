import {useEffect, useState} from 'react';
import { Button, notification, Modal } from "antd";
import {ExclamationCircleFilled} from '@ant-design/icons';
import Card from "../../components/Card";
import {useClassName} from "../../utils/cn";
import { api } from '../../utils/api';
import CreateNewsModal from './components/CreateNewsModal';
import { CreateNewsPayload, NewsType } from '../../types/News.type';

import './style.scss';

const { confirm } = Modal;

const News = () => {
  const cn = useClassName('news');
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submit, setSubmit] = useState(false);
  const [newsList, setNewsList] = useState<NewsType[]>([]);
  const [currentUpdateNews, setCurrentUpdateNews] = useState<NewsType | null>(null);
  const [notApi, contextHolder] = notification.useNotification();

  const handleOpenUpdate = (news: NewsType) => {
    setCurrentUpdateNews(news);
    setModal(true);
  }

  const handleCloseModal = () => {
    if (currentUpdateNews) {
      setCurrentUpdateNews(null);
    }
    setModal(false)
  }

  const handleCreateNews = (payload: CreateNewsPayload): Promise<string> => {
    setSubmit(true);
    return new Promise((resolve) => {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('type', payload.type);
    formData.append('shortDescription', payload.shortDescription);
    formData.append('fullDescription', payload.fullDescription);
    if (payload.image) {
      formData.append('image', payload.image);
    }

    api.post<{data: NewsType, status: string, message: null}>('news', formData )
    .then(response => {
      const responseData = response.data;
      if (responseData.status === 'success' && responseData.data) {
        setNewsList(prev => [responseData.data, ...prev]);
        resolve('create');
      } else {
        throw new Error('Failed create news')
      }
    })
    .catch(error => notApi.error({ message: error.message }))
    .finally(() => {
      handleCloseModal();
      setSubmit(false)
    });
  })
  }

  const handleUpdateNews = (payload: CreateNewsPayload) => {
    if (!currentUpdateNews) return;

    setSubmit(true);
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('type', payload.type);
    formData.append('shortDescription', payload.shortDescription);
    formData.append('fullDescription', payload.fullDescription);
    if (payload.image) {
      formData.append('image', payload.image);
    }

    api.put<{data: NewsType, status: string, message: null}>(`news/${currentUpdateNews._id}`, formData )
    .then(response => {
      const responseData = response.data;

      if (responseData.status === 'success' && responseData.data) {
        const findNewsId = newsList.findIndex(item => item._id === currentUpdateNews._id);

        if (findNewsId !== -1) {
          //@ts-ignore
          const newArrNews = newsList.with(findNewsId, responseData.data)
          setNewsList(newArrNews);
        }
        
      } else {
        throw new Error('Failed update news')
      }
    })
    .catch(error => notApi.error({ message: error.message }))
    .finally(() => {
      handleCloseModal();
      setSubmit(false)
    });
  }


  const handleDeleteNews = (id: string) => {
    const handleRemoveNews = () => {
      api.delete(`news/${id}`)
      .then(response => {
        if (response.data.status === 'success') {
          setNewsList(prev => prev.filter(item => item._id !== id));
        } else {
          throw new Error('Failed remove news')
        }
      })
      .catch(error => notApi.error({ message: error.message }))
      .finally(() => setLoading(false));
  }

    confirm({
      title: 'Вы уверены, что хотите удалить?',
      icon: <ExclamationCircleFilled />,
      content: 'Удалив новость, ее невозможно будет вернуть.',
      okText: 'Удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: handleRemoveNews,
      onCancel() {
        console.log('Cancel');
      }
    });
  };

  
  useEffect(() => {
    const loadAllNews = () => {
      setLoading(true);
      api.get<{data: NewsType[], status: string, message: null}>('news')
      .then(response => {
      if (response.data.status === 'success') {
        setNewsList(() => response.data.data);
      } else {
        throw new Error('Failed get all news')
      }
      })
      .catch(error => notApi.error({ message: error.message }))
      .finally(() => setLoading(false));
    }

    loadAllNews();

  },[])

  if (loading) return (<div>Loading...</div>)


  return (
    <div className={cn()}>
      {contextHolder}
      <div className={cn('header')}>
        <h1>Новости</h1>
        <Button type='primary' onClick={() => setModal(true)}>Создать новости</Button>
      </div>
      <CreateNewsModal
        confirmLoading={submit}
        open={modal}
        handleCancel={handleCloseModal}
        handleOk={handleCreateNews}
        handleUpdateNews={handleUpdateNews}
        currentUpdateNews={currentUpdateNews}
      />
    <ul className={cn('newsList')}>
      {newsList.map(news =>
      <Card
      handleRemoveNews={handleDeleteNews}
      news={news}
      key={news._id}
      handleOpenUpdate={handleOpenUpdate}
      />
    )}
    </ul>
    </div>
  );
};

export default News;