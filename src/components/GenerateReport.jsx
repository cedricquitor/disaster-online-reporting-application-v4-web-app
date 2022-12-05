import { React, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

const GenerateReport = () => {
  const componentRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  const data = location.state?.data;
  const type = location.state?.type;

  // Date
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = mm + "/" + dd + "/" + yyyy;

  const pageStyle = `
  @page {
    margin: 15mm 15mm 15mm 15mm;
  }

  @media all {
    .pagebreak {
      display: none;
    }
  }

  @media print {
    .pagebreak {
      page-break-before: always;
    }
  }
`;

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: type ? type : "default",
    onAfterPrint: () => navigate("/"),
    pageStyle: pageStyle,
  });

  useEffect(() => {
    handlePrint();
  }, []);

  useEffect(() => {
    console.log(data, type);
  }, []);

  return (
    <div ref={componentRef} className="bg-safe-white h-screen flex justify-center mx-auto">
      <div className="flex flex-col items-center">
        <div className="mt-4 flex flex-col items-center">
          <h1 className="text-xl font-bold text-center">Disaster Online Reporting Application v4</h1>
          <h1 className="text-xl font-bold text-center">{type === "disaster-report" ? "Disaster Reports" : "Default"}</h1>
          <div className="flex gap-[32rem]">
            <p className="text-lg">{data?.length} records</p>
            <p className="text-lg">{today}</p>
          </div>
        </div>
        {/* If type === "evacuation-center" */}
        {/* If type === "disaster-report" */}
        {location.state?.type === "disaster-report" ? (
          // <div className="flex flex-col w-11/12 xl:w-10/12 2xl:w-5/6 mx-auto mt-4 items-center">
          //   <div className="-my-2 sm:-mx-6 lg:-mx-8">
          //     <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          //       <div className="shadow overflow-hidden border-b border-primary-gray sm:rounded-lg">
          //         <table className="min-w-full divide-y divide-secondary-green">
          //           <thead className="bg-primary-green">
          //             <tr>
          //               <th scope="col" className="px-2 py-3 text-left text-base font-bold text-safe-white uppercase tracking-wider">
          //                 Disaster
          //               </th>
          //               <th scope="col" className="px-2 py-3 text-left text-base font-bold text-safe-white uppercase tracking-wider">
          //                 Description
          //               </th>
          //               <th scope="col" className="px-2 py-3 text-left text-base font-bold text-safe-white uppercase tracking-wider">
          //                 Name
          //               </th>
          //               <th scope="col" className="px-2 py-3 text-left text-base font-bold text-safe-white uppercase tracking-wider">
          //                 Date
          //               </th>
          //             </tr>
          //           </thead>
          //           <tbody className="bg-safe-white divide-y divide-primary-gray">
          //             {/* Filter and map report items */}
          //             {location.state?.data.map((report) => {
          //               const { reportId, disasterType, address, description, fullName, date } = report;
          //               return (
          //                 <tr key={reportId}>
          //                   <td className="px-4 py-4 whitespace-nowrap">
          //                     <div className="flex items-center">
          //                       <div>
          //                         <div className="text-sm font-medium text-secondary-green">{disasterType}</div>
          //                         <div className="text-sm text-primary-gray">
          //                           <p className="break-all">
          //                             <TruncateText length={30}>{address}</TruncateText>
          //                           </p>
          //                         </div>
          //                       </div>
          //                     </div>
          //                   </td>
          //                   <td className="px-2 py-4 whitespace-nowrap">
          //                     <div className="text-sm text-safe-black">
          //                       <TruncateText length={30}>{description}</TruncateText>
          //                     </div>
          //                   </td>
          //                   <td className="px-2 py-4 whitespace-nowrap">
          //                     <div className="text-sm text-safe-black">{fullName}</div>
          //                   </td>
          //                   <td className="px-2 py-4 whitespace-nowrap text-sm text-safe-black">{date}</td>
          //                 </tr>
          //               );
          //             })}
          //           </tbody>
          //         </table>
          //       </div>
          //     </div>
          //   </div>
          // </div>
          <table className="border mt-4 mx-4">
            <thead className="border">
              <tr>
                <th>Disaster</th>
                <th>Description</th>
                <th>Name</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {/* Filter and map report items */}
              {location.state?.data.map((report) => {
                const { reportId, disasterType, address, description, fullName, date } = report;
                return (
                  <tr key={reportId} className="border">
                    <td className="p-4">
                      <div className="flex flex-col">
                        <p>{disasterType}</p>
                        <p>{address}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <p>{description}</p>
                    </td>
                    <td className="p-4">
                      <p>{fullName}</p>
                    </td>
                    <td className="p-4">
                      <p>{date}</p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : null}
      </div>
    </div>
  );
};

export default GenerateReport;
