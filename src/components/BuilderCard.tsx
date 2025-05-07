interface Builder {
  id: number;
  name: string;
  image: string;
  projects: number;
  rating: number;
  category: string;
  experience: string;
  location: string;
}

interface BuilderCardProps {
  builder: Builder;
}

const BuilderCard = ({ builder }: BuilderCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <img
          src={builder.image}
          alt={builder.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-gray-800">{builder.name}</h3>
          <p className="text-sm text-gray-500">{builder.category}</p>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Experience:</span>
          <span className="font-medium">{builder.experience}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Projects:</span>
          <span className="font-medium">{builder.projects}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Rating:</span>
          <span className="font-medium">{builder.rating}/5</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Location:</span>
          <span className="font-medium">{builder.location}</span>
        </div>
      </div>
    </div>
  );
};

export default BuilderCard; 