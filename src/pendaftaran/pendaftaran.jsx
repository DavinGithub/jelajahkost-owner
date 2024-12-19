import { Users, Package, TrendingUp, Clock, Edit, Eye } from 'lucide-react';
import Sidebar from '../layout/sidebar';
import React, { useEffect, useState } from 'react';
import PendaftaranModal from './pendaftaranmodal';

const Pendaftaran = () => {
  const [kosts, setKosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedKost, setSelectedKost] = useState(null);
  const [error, setError] = useState(null);
  const [waNumber, setWaNumber] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    phone_number: '',
    image: '',
    description: '',
    address: '',
    city: '',
    regency: '',
    kost_type: 'kost_reguler',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const access_token = localStorage.getItem('access_token');
      if (!access_token) {
        setError('No authentication token found');
        return;
      }

      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      const response = await fetch('https://bpkbautodigital.com/api/kost', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Accept': 'application/json',
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === 'success') {
        setIsModalOpen(false);
        fetchKosts();
        setFormData({
          name: '',
          price: '',
          phone_number: '',
          image: '',
          description: '',
          address: '',
          city: '',
          regency: '',
          kost_type: 'kost_reguler',
        });
        setError(null);
      } else {
        setError(data.message || 'Failed to submit kost');
      }
    } catch (error) {
      console.error('Error submitting kost:', error);
      setError(error.message);
    }
  };

 

  const fetchKosts = async () => {
    try {
      const access_token = localStorage.getItem('access_token');
      if (!access_token) {
        setError('No authentication token found');
        return;
      }
      const response = await fetch('https://bpkbautodigital.com/api/kost/my-kost', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === 'success') {
        setKosts(data.data);
        setError(null);
      } else {
        setError(data.message || 'Failed to fetch kosts');
      }
    } catch (error) {
      console.error('Error fetching kosts:', error);
      setError(error.message);
    }
  };

  const fetchwa = async () => {
    try {
      const response = await fetch('https://bpkbautodigital.com/api/whatsapp', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      if (data.status === 'success') {
        setWaNumber(data.wa_number);
        setError(null);
      } else {
        setError(data.message || 'Failed to fetch WhatsApp number');
      }
    } catch (error) {
      console.error('Error fetching WhatsApp number:', error);
      setError(error.message);
    }
  };
  

  useEffect(() => {
    fetchKosts();
    fetchwa(); 
  }, []);

  const handleDetailClick = async (id) => {
    try {
      const access_token = localStorage.getItem('access_token');
      if (!access_token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch(`https://bpkbautodigital.com/api/kost/detail/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === 'success') {
        setSelectedKost(data.data);
        setIsModalOpen(true);
        setError(null);
      } else {
        setError(data.message || 'Failed to fetch kost detail');
      }
    } catch (error) {
      console.error('Error fetching kost detail:', error);
      setError(error.message);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatKostType = (type) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <div className="ml-64 p-8">
      <h1 className="text-2xl font-semibold mb-6">Kost didaftarkan</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Registrasi kost</h2>
            <div className='flex gap-4'> 
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm transition-all duration-200"
            >
              Tambahkan kost
            </button>
            <button
            onClick={() => {
              if (waNumber) {
                window.open(waNumber, '_blank');
              } else {
                alert('WhatsApp number not available.');
              }
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm transition-all duration-200"
          >
            Perpanjang kost
          </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="pb-4">No</th>
                  <th className="pb-4">Image</th>
                  <th className="pb-4">Name</th>
                  <th className="pb-4">Type</th>
                  <th className="pb-4">Price</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {kosts.map((kost, index) => (
                  <tr key={kost.id} className="border-t">
                    <td className="py-4">{index + 1}</td>
                    <td className="py-4">
                      <img src={kost.image} alt={kost.name} className="w-12 h-12 rounded-md object-cover" />
                    </td>
                    <td className="py-4">{kost.name}</td>
                    <td className="py-4">{formatKostType(kost.kost_type)}</td>
                    <td className="py-4">{formatPrice(kost.price)}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        kost.status === 'tersedia' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {kost.status.charAt(0).toUpperCase() + kost.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => handleDetailClick(kost.id)}
                        className="text-blue-500 hover:text-blue-700 mr-2"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {/* Handle edit */}}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <PendaftaranModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          selectedKost={selectedKost}
        />
      </div>
    </div>
  );
};

export default Pendaftaran;