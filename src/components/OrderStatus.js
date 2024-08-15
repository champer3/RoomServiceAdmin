import React, { useState, useEffect, useRef } from 'react';

const OrderStatus = ({ order }) => {
    const [selectedStatus, setSelectedStatus] = useState('Processing');
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const statusOptions = [
        { label: 'Processing', value: 'Processing', color: 'bg-[#FFF0EA]' },
        { label: 'Delivered', value: 'Delivered', color: 'bg-[#039F0330]' },
        { label: 'Canceled', value: 'Canceled', color: 'bg-[#FEECEE]' },
        { label: 'Shipped', value: 'Shipped', color: 'bg-[#EAF8FF]' },
    ];

    const handleSelect = (option) => {
        setSelectedStatus(option.value);
        setIsOpen(false);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const renderLabel = () => {
        const selectedOption = statusOptions.find(option => option.value === selectedStatus);
        const labelClass = `inline-block mt-2 text-sm font-bold px-2 py-1 rounded text-white ${selectedOption?.color}`;
        return <span className={labelClass}>{selectedStatus}</span>;
    };

    const selectedOption = statusOptions.find(option => option.value === selectedStatus);

    return (
        <td className="p-2 relative" ref={dropdownRef}>
            <div className="inline-block">
                <button
                    className={`w-full max-w-xs p-2 border-0 border-gray-300 rounded-md text-gray-900 focus:outline-none ${selectedOption?.color} flex items-center justify-between`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {selectedStatus}
                    <i className="fas fa-chevron-down ml-2"></i> {/* Font Awesome icon */}
                </button>
                {isOpen && (
                    <ul className="absolute z-10 mt-2 w-full max-w-xs bg-white border border-gray-300 rounded-md shadow-lg">
                        {statusOptions.map((option) => (
                            <li
                                key={option.value}
                                className={`p-2 cursor-pointer hover:bg-gray-100 ${option.color} text-gray-900`}
                                onClick={() => handleSelect(option)}
                            >
                                {option.label}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </td>
    );
};

export default OrderStatus;