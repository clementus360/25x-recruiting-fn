export default function Star({ selected }: { selected: boolean }) {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 15 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`transition duration-300 transform ${selected ? 'hover:scale-125 hover:fill-yellow-400' : 'hover:scale-125 hover:fill-gray-500'
                }`}
        >
            <path
                d="M7.60004 0.5L9.17163 5.33688H14.2574L10.1429 8.32624L11.7145 13.1631L7.60004 10.1738L3.48554 13.1631L5.05714 8.32624L0.942641 5.33688H6.02844L7.60004 0.5Z"
                fill={selected ? '#E6D45D' : '#787878'}
            />
        </svg>
    );
}
