import axios from "axios";
import  { useState } from "react";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";
// If dark mode is needed, import `dark.css`.
// import 'react18-json-view/src/dark.css'

interface ContactResponse {
  primaryContactId: number;
  emails: string[];
  phoneNumbers: string[];
  secondaryContactIds: number[];
}

const App = () => {
  const [data, setData] = useState({
    email: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [res, setRes] = useState<ContactResponse>({
    primaryContactId: 0,
    emails: [],
    phoneNumbers: [],
    secondaryContactIds: [],
  });
  const getDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.post(import.meta.env.VITE_BASE_URL, data);
      setRes(response.data.contact);
    } catch (err) {
      //@ts-ignore
      if (err?.message) alert(err?.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex flex-col items-center py-10">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800">Contact Finder</h1>
        <p className="mt-2 text-gray-600">
          Lookup primary and secondary contacts by email or phone
        </p>
      </header>

      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-lg p-8">
        <div className="flex flex-col md:flex-row gap-6">
          <form
            className="flex-1 flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              getDetails();
            }}
          >
            <h2 className="text-xl font-semibold text-gray-700">
              Enter details
            </h2>
            <div className="flex flex-col gap-2">
              <label className="text-gray-600">Email:</label>
              <input
                type="email"
                value={data.email}
                className="p-2 px-4 text-gray-800 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="test@gmail.com"
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-gray-600">Phone Number:</label>
              <input
                type="text"
                value={data.phoneNumber}
                placeholder="1234567890"
                className="p-2 px-4 text-gray-800 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
                onChange={(e) =>
                  setData({ ...data, phoneNumber: e.target.value })
                }
              />
            </div>
            <button
              disabled={loading}
              className="mt-4 p-3 rounded-2xl w-full bg-blue-500 font-semibold text-white hover:bg-blue-600 transition-all duration-150 flex justify-center items-center"
            >
              {loading ? <span className="loader"></span> : "Identify"}
            </button>
          </form>

          <div className="flex-1 bg-gray-50 rounded-xl p-4 h-full">
            {res.primaryContactId ? (
              <JsonView src={res} />
            ) : (
              <p className="text-gray-400">Results will appear here</p>
            )}
          </div>
        </div>

        {res.primaryContactId !== 0 && (
          <section className="mt-6 bg-gray-100 p-4 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-700 mb-1">
                  Primary Contact ID:
                </h3>
                <p className="text-gray-800">{res.primaryContactId}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-1">Emails:</h3>
                <ul className="text-gray-800 list-disc list-inside">
                  {res.emails.map((email, idx) => (
                    <li key={idx}>{email}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-1">
                  Phone Numbers:
                </h3>
                <ul className="text-gray-800 list-disc list-inside">
                  {res.phoneNumbers.map((phone, idx) => (
                    <li key={idx}>{phone}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-1">
                  Secondary Contact IDs:
                </h3>
                <p className="text-gray-800">
                  {res.secondaryContactIds.join(", ")}
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default App;
