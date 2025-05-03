import { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

// Komponen SearchableSelect yang akan digunakan untuk nationality
const SearchableSelect = ({ 
  options, 
  selectedOption, 
  onSelect, 
  placeholder = "Select an option...",
  hasError = false,
  errorMessage = ""
}) => {
  // State untuk input pencarian
  const [searchTerm, setSearchTerm] = useState('');
  
  // State untuk menampilkan/menyembunyikan dropdown
  const [isOpen, setIsOpen] = useState(false);
  
  // Referensi untuk dropdown
  const dropdownRef = useRef(null);

  // Filter opsi berdasarkan pencarian
  const filteredOptions = options.filter(option =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle pilihan item
  const handleSelect = (option) => {
    onSelect(option);
    setSearchTerm('');
    setIsOpen(false);
  };

  // Tutup dropdown ketika klik di luar komponen
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div 
        className={`flex items-center justify-between p-3 border ${
          hasError ? "border-red-500" : "border-gray-300"
        } rounded-lg bg-white cursor-pointer`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1 truncate">
          {selectedOption ? selectedOption.name : placeholder}
        </div>
        <div>
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>
      
      {isOpen && (
        <div className="absolute w-full mt-1 border border-gray-300 rounded-lg bg-white shadow-lg z-10">
          {/* Search Box */}
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-2 top-2 text-gray-400" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search options..."
                className="w-full pl-8 p-2 border border-gray-300 rounded-lg"
                autoFocus
              />
            </div>
          </div>
          
          {/* Options List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => (
                <div 
                  key={option.id}
                  className={`p-3 cursor-pointer hover:bg-gray-100 ${
                    selectedOption && selectedOption.id === option.id ? 'bg-blue-100' : ''
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  {option.name}
                </div>
              ))
            ) : (
              <div className="p-3 text-gray-500">No options found</div>
            )}
          </div>
        </div>
      )}
      
      {hasError && errorMessage && (
        <p className="text-red-500 text-xs mt-1">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default SearchableSelect;
