'use client';

import { logout } from "./admin/login/actions";

export default function Home() {
  return (
    <div className="p-8 bg-dark-gray text-gray-200 space-y-8">
      <button 
        className="px-4 py-2 bg-red-500 text-white rounded" 
        onClick={async () => { await logout(); }}
      >
        Logout
      </button>

      {/* Display1 */}
      <div>
        <p className="p">Display1 - Campton Bold Uppercase 72px</p>
        <h1 className="display1">THE PEOPLE OF THE KINGDOM</h1>
        <hr className="w-300 h-1 ml-0 my-4 bg-gray-100 border-0 rounded-sm" />
      </div>

      {/* Display2 */}
      <div>
        <p className="p">Display2 - Campton Bold Uppercase 60px</p>
        <h2 className="display2">THE PEOPLE OF THE KINGDOM</h2>
        <hr className="w-300 h-1 ml-0 my-4 bg-gray-100 border-0 rounded-sm" />
      </div>

      {/* h1 */}
      <div>
        <p className="p">h1 - Campton Bold 48px</p>
        <h1 className="h1">The People of the Kingdom</h1>
        <hr className="w-300 h-1 ml-0 my-4 bg-gray-100 border-0 rounded-sm" />
      </div>

      {/* h2 */}
      <div>
        <p className="p">h2 - Campton Semi Bold 30px</p>
        <h2 className="h2">The People of the Kingdom</h2>
        <hr className="w-300 h-1 ml-0 my-4 bg-gray-100 border-0 rounded-sm" />
      </div>

      {/* h3 */}
      <div>
        <p className="p">h3 - Campton Medium 24px</p>
        <h3 className="h3">The Joke Tax</h3>
        <hr className="w-300 h-1 ml-0 my-4 bg-gray-100 border-0 rounded-sm" />
      </div>

      {/* h4 */}
      <div>
        <p className="p">h4 - Campton Book 20px </p>
        <h4 className="h4">People stopped telling jokes</h4>
        <hr className="w-300 h-1 ml-0 my-4 bg-gray-100 border-0 rounded-sm" />
      </div>

      {/* Paragraph */}
      <div>
        <p className="p">p - Schibsted Grotesk Regular 16px</p>
        <p className="p">
          The king, seeing how much happier his subjects were, realized the error of his ways and repealed the joke tax.
        </p>
        <hr className="w-300 h-1 ml-0 my-4 bg-gray-100 border-0 rounded-sm" />
      </div>
    </div>
  );
}
