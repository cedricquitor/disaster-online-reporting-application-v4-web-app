import React from "react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import DoraLogo from "../assets/dora_logo.svg";

const GenerateReport = ({ data, type }) => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: type ? type : "default",
  });

  return (
    <div ref={componentRef} className="bg-safe-white h-screen flex justify-center">
      <button onClick={() => handlePrint()}>Test Button</button>
      <div className="flex flex-col">
        <div>
          <img src={DoraLogo} alt="DORAv4 Home Button" className="w-[8rem] h-[8rem]" />
        </div>
        <div>Table</div>
      </div>
    </div>
  );
};

export default GenerateReport;
