interface Category {
  id: number;
  name: string;
  icon: string;
}

interface BuilderCategoryItemProps {
  category: Category;
}

const BuilderCategoryItem = ({ category }: BuilderCategoryItemProps) => {
  return (
    <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer min-w-[100px]">
      <span className="text-2xl mb-2">{category.icon}</span>
      <span className="text-sm font-medium text-gray-700">{category.name}</span>
    </div>
  );
};

export default BuilderCategoryItem; 