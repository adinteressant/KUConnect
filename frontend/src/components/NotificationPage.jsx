import React from 'react';

const NotificationPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-4xl font-serif font-bold text-gray-800 mb-6">Notifications</h1>

        <div className="space-y-4">
          <div className="bg-gray-200 p-4 rounded-lg">
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

          <div className="bg-blue-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-800">
                  Upcoming Event Reminder
                </h3>
                <p className="text-blue-600">
                  Don't forget, our annual conference is this Saturday at 2pm.
                </p>
              </div>
              <div className="text-blue-400">2 days ago</div>
            </div>
          </div>

          <div className="bg-orange-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-orange-800">
                  Payment Due Tomorrow
                </h3>
                <p className="text-orange-600">
                  Your monthly subscription payment is due tomorrow. Please make sure to pay on time.
                </p>
              </div>
              <div className="text-orange-400">1 week ago</div>
            </div>
          </div>

          <div className="bg-purple-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-purple-800">
                  New Message from John
                </h3>
                <p className="text-purple-600">
                  John sent you a new message. Click here to view.
                </p>
              </div>
              <div className="text-purple-400">3 days ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;