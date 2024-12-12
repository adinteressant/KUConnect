import React from 'react';

const NotificationPage = () => {
  return (
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-full h-full max-h-full">
        <h1 className="text-4xl font-serif text-gray-800 mb-6">Notifications</h1>

        <div className="space-y-4">
          <div className="bg-gray-200 p-4 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Product Release at Midnight
                </h3>
                <p className="text-gray-600">
                  Our new product is launching at midnight tonight. Be sure to check it out!
                </p>
              </div>
              <div className="text-gray-400">12:00 AM</div>
            </div>
          </div>    
        </div>
      </div>
  );
};

export default NotificationPage;