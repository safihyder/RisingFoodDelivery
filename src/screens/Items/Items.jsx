import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Card from "../../components/Card/Card";
import "./Items.css";
import AppwriteItemService from '../../appwrite/itemsconfig';
import { Query } from 'appwrite';
import Loading from '../../components/Loading';

const Items = ({ category, restaurantName }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            setIsLoading(true);
            try {
                let queries = [];

                // Add restaurant filter if restaurantName is provided
                if (restaurantName) {
                    queries.push(Query.equal('resname', restaurantName));
                }

                // Add category filter if category is provided
                if (category) {
                    queries.push(Query.equal('category', category));
                }

                const data = await AppwriteItemService.getItems(queries);

                if (data?.documents) {
                    const processedItems = data.documents.map((item) => ({
                        ...item,
                        image: AppwriteItemService.getFilePreview(item.image)
                    }));
                    setItems(processedItems);
                    setFilteredItems(processedItems);

                    // Extract unique categories
                    const uniqueCategories = [...new Set(processedItems.map(item => item.category))];
                    setCategories(uniqueCategories);
                }
            } catch (error) {
                console.error('Error fetching items:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchItems();
    }, [category, restaurantName]);

    useEffect(() => {
        if (!items) return;

        let filtered = [...items];

        // Apply category filter
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(item => item.category === selectedCategory);
        }

        // Apply search filter
        if (searchQuery.trim()) {
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredItems(filtered);
    }, [searchQuery, selectedCategory, items]);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="w-full mt-8">
            {/* Heading */}
            <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                    {restaurantName ? `${restaurantName}'s Menu` : 'All Items'}
                    {category && ` - ${category}`}
                </h1>
            </div>

            {/* Filters Section */}
            <div className="max-w-4xl mx-auto mb-8 px-4">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    {/* Search Bar */}
                    <div className="relative flex-1 w-full">
                        <input
                            type="text"
                            placeholder="Search food items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        <svg
                            className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>

                    {/* Category Select */}
                    <div className="w-full md:w-48">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                        >
                            <option value="all">All Categories</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Results Count */}
                <p className="mt-2 text-sm text-gray-500 text-center">
                    {filteredItems.length} items found
                </p>
            </div>

            {/* Items Grid */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 justify-items-center">
                {filteredItems.length > 0 ? (
                    filteredItems.map((item, index) => (
                        <Card key={index} item={item} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <h3 className="mt-2 text-lg font-medium text-gray-900">No items found</h3>
                        <p className="mt-1 text-gray-500">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>
        </div>
    );
};

Items.propTypes = {
    category: PropTypes.string,
    restaurantName: PropTypes.string
};

export default Items;