import {useClassName} from "../../utils/cn";
import {Button, Tag} from "antd";
import './style.scss';
import { NewsType } from "../../types/News.type";

type Props = {
  news: NewsType;
  handleRemoveNews: (id:string) => void;
  handleOpenUpdate: (news: NewsType) => void;
}

const Card = ({ news, handleRemoveNews, handleOpenUpdate }: Props) => {
  const cn = useClassName('card');

  const srcImage = news.image ? `http://localhost:8080/uploads/${news.image}` : 'Placeholder.jpg'

  return (
    <div className={cn()}>
      <div className={cn('image-container')}>
        <img  src={srcImage} alt="News image" className={cn('image')} />
      </div>

      <div className={cn('content')}>
        <h4 className={cn('title')}>{news.title}</h4>
        <Tag color="green">{news.type === 'news' ? 'Новость': 'Продвижение'}</Tag>

        <div className={cn('buttons')}>
          <Button onClick={() => handleOpenUpdate(news)}>Редактировать</Button>
          <Button onClick={() => handleRemoveNews(news._id)} danger>Удалить</Button>
        </div>
      </div>
    </div>
  );
};

export default Card;