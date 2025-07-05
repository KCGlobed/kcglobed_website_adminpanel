import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux';
import { changeMode, getUser, setPage } from '../../../store/slices/userSlice';
// import { useModal } from '../../../context/ModalContext';
const ActiveUser: React.FC = () => {
  const { results, loading, count, page, type } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const totalPages = Math.ceil(count / 20);

  useEffect(() => {
    dispatch(getUser({ page, type }));
  }, [page, type]);

  useEffect(() => {
    console.log("Users data:", results);
  }, [loading]);

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
  };

  const handleType = (type: number) => {
    dispatch(changeMode(type))
    console.log(type)
  }
    // const { showModal } = useModal();

  // const handleOpen = () => {
  //   showModal({
  //     title: "Large Modal",
  //     size: "lg",
  //     content: (
  //       <div>
  //         <p>This is a dynamic modal with size <strong>lg</strong>.</p>
  //         <div className="mt-4 flex justify-end gap-2">
  //           <button className="px-4 py-2 border rounded" onClick={() => alert("Cancel clicked")}>
  //             Cancel
  //           </button>
  //           <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => alert("Confirmed")}>
  //             Confirm
  //           </button>
  //         </div>
  //       </div>
  //     ),
  //   });
  // };

  return (
    <div>
      <div className="flex mb-4 gap-4">
        <button
          onClick={() => handleType?.(1)}
          className="cursor-pointer px-5 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
        >
          Active Users
        </button>
        <button
          onClick={() => handleType?.(2)}
          className="cursor-pointer px-5 py-2 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
        >
          Initiated Users
        </button>
      </div>
      <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200 max-h-[75vh]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 text-sm text-gray-700">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">ID</th>
              <th className="px-6 py-3 text-left font-semibold">Full Name</th>
              <th className="px-6 py-3 text-left font-semibold">Email</th>
              <th className="px-6 py-3 text-left font-semibold">Subcription Type</th>
              <th className="px-6 py-3 text-left font-semibold">Plan Info</th>
              <th className="px-6 py-3 text-left font-semibold">End Date</th>
              <th className="px-6 py-3 text-left font-semibold">Order Date</th>

            </tr>
          </thead>
          <tbody className="text-sm text-gray-600 divide-y divide-gray-100">
            {results.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-400">
                  No essays found.
                </td>
              </tr>
            ) : (
              results.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">{user.id}</td>
                  <td className="px-6 py-4">{user.first_name} {user.last_name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.subscription_type}</td>
                  <td className="px-6 py-4">{user?.plan_info[0]?.plan_name}</td>
                  <td className="px-6 py-4">{user?.end_date}</td>
                  <td className="px-6 py-4">{user?.order_date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="flex justify-center gap-2 mt-6 fixed right-10 bottom-5">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded cursor-pointer ${page === i + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

    </div>
  )
};

export default ActiveUser;
