import { useParams } from 'react-router-dom';
import CardTemplate from './CardTemplate';
import DarkTemplate from './DarkTemplate';
import GalaxyTemplate from './GalaxyTemplate';

const TemplatePage = () => {
  const { type, topicId } = useParams();

  return (
    <div className="p-6">
      {type === 'card' && <CardTemplate topicId={topicId} />}
      {type === 'dark' && <DarkTemplate topicId={topicId} />}
      {type === 'purple' && <GalaxyTemplate topicId={topicId} />}
      {!['card', 'dark', 'purple'].includes(type) && <div>Unknown template type.</div>}
    </div>
  );
};

export default TemplatePage;