


// "use client";
// import { useState, useEffect } from "react";
// import { Bar, Line, Doughnut, Pie, Scatter } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { BsUpload } from "react-icons/bs";
// import zoomPlugin from "chartjs-plugin-zoom";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
//   zoomPlugin
// );

// interface ChartData {
//   labels: string[];
//   datasets: {
//     label: string;
//     data: number[];
//     backgroundColor?: string;
//     borderColor?: string;
//     fill?: boolean;
//   }[];
// }

// export default function Dashboard() {
//   const [chartData, setChartData] = useState<Record<string, ChartData | null>>({
//     scatterChartData: null,
//     pieChartData: null,
//     donutChartData: null,
//     lineChartData: null,
//     barChartData: null,
//   });
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [selectedChart, setSelectedChart] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);
//   const [chartWidth, setChartWidth] = useState<number>(0);
//   const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSelectedFile(event.target.files?.[0] || null);
//   };

//   const handleSubmit = async () => {
//     if (!selectedFile) return;
//     setLoading(true);

//     const formData = new FormData();
//     formData.append("file", selectedFile);

//     try {
//       const response = await fetch("http://localhost:3012/api/analyze-excel", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) throw new Error("Error uploading file.");
//       const result = await response.json();
//       const processedData = result.data?.processedData;

//       if (!processedData) throw new Error("Invalid response structure.");

//       const generateChartData = (chartType: string): ChartData | null => {
//         const chartInfo = processedData[chartType]?.[0];
//         if (!chartInfo) return null;

//         const labels = Object.keys(chartInfo.data);
//         const values = Object.values(chartInfo.data);

//         return {
//           labels,
//           datasets: [
//             {
//               label: chartInfo.label || chartType,
//               data: values as number[],
//               backgroundColor: chartType.includes("Bar")
//                 ? "rgba(54, 162, 235, 0.5)"
//                 : "rgba(255, 99, 132, 0.5)",
//               borderColor: chartType.includes("Line")
//                 ? "rgba(255, 99, 132, 1)"
//                 : undefined,
//               fill: !chartType.includes("Line"),
//             },
//           ],
//         };
//       };

//       setChartData({
//         scatterChartData: generateChartData("Scatter Plot"),
//         pieChartData: generateChartData("Pie Chart"),
//         donutChartData: generateChartData("Donut Chart"),
//         lineChartData: generateChartData("Line Chart"),
//         barChartData: generateChartData("Bar Chart"),
//       });
//     } catch (error) {
//       console.error("Error uploading file:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (selectedChart && chartData[selectedChart]) {
//       const baseLabels = chartData[selectedChart]?.labels || [];
//       setChartWidth((selectedLabels.length || baseLabels.length) * 150);
//     }
//   }, [selectedChart, selectedLabels, chartData]);
  

//   const getChartOptions = (type: string) => ({
//     responsive: true,
//     maintainAspectRatio: false,
//     scales: ["pieChartData", "donutChartData"].includes(type)
//       ? {}
//       : {
//           x: {
//             ticks: {
//               autoSkip: false,
//               maxRotation: type === 'barChartData' || type === 'scatterChartData' ? 20 : 100,
//               minRotation: type === 'barChartData' || type === 'scatterChartData' ? 0 : 90,
//               autoSkipPadding: 20,
//             },
//             grid: {
//               display: true,
//               drawTicks: false,
//               tickLength: 100,
//               lineWidth: 1
//             },
//           },
//           y: {
//             beginAtZero: true,
//             ticks: {
//               precision: 0,
//             },
//           },
//         },
//     plugins: {
//       legend: {
//         display: true,
//         position: "top",
//       },
//       tooltip: {
//         enabled: true,
//       },
//     },
//   });

//   const applyFilter = (data: ChartData | null) => {
//     if (!data) return data;

//     const filteredLabels = selectedLabels.length
//       ? data.labels.filter(label => selectedLabels.includes(label))
//       : data.labels;

//     const filteredData = data.datasets.map(dataset => ({
//       ...dataset,
//       data: filteredLabels.map(label => dataset.data[data.labels.indexOf(label)])
//     }));

//     return {
//       labels: filteredLabels,
//       datasets: filteredData,
//     };
//   };

//   const handleCheckboxChange = (label: string) => {
//     setSelectedLabels(prev =>
//       prev.includes(label)
//         ? prev.filter(item => item !== label)
//         : [...prev, label]
//     );
//   };

//   const handleSelectAll = () => {
//     if (selectedChart && chartData[selectedChart]) {
//       setSelectedLabels(chartData[selectedChart]?.labels || []);
//     }
//   };

//   const handleClearAll = () => {
//     setSelectedLabels([]);
//   };

//   const renderChart = (type: string, ChartComponent: any) => {
//     const data = applyFilter(chartData[type]);

//     if (!loading && data) {
//       return (
//         <div className="card p-4 border rounded shadow-sm">
//           <div style={{ width: "100%", overflowX: "auto" }}>
//             <div
//               style={{
//                 minWidth: ["lineChartData", "barChartData"].includes(type)
//                   ? `${chartWidth}px`
//                   : "auto",
//                 height: "400px",
//               }}
//             >
//               <ChartComponent data={data} options={getChartOptions(type)} />
//             </div>
//           </div>
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="flex flex-col md:flex-row h-screen border border-black">
//       <div className="w-full md:w-1/4 bg-white p-5 border-t md:border-l md:border-black">
//         <h2 className="text-lg font-bold mb-2">Upload File</h2>
//         <input type="file" onChange={handleFileChange} className="border p-2 w-full" />
//         <button
//           onClick={handleSubmit}
//           className="bg-blue-500 text-white p-2 rounded flex items-center justify-center mt-4"
//         >
//           <BsUpload className="mr-2" /> Submit
//         </button>

//         {selectedChart && (
//           <div className="mt-4">
//             <h3 className="font-semibold">Filters</h3>
//             <button onClick={handleSelectAll} className="bg-green-500 text-white px-2 py-1 rounded mt-2">Select All</button>
//             <button onClick={handleClearAll} className="bg-red-500 text-white px-2 py-1 rounded mt-2 ml-2">Clear All</button>
//             {chartData[selectedChart]?.labels.map(label => (
//               <div key={label} className="flex items-center">
//                 <input
//                   type="checkbox"
//                   checked={selectedLabels.includes(label)}
//                   onChange={() => handleCheckboxChange(label)}
//                 />
//                 <label className="ml-2">{label}</label>
//               </div>
//             ))}
//           </div>
//         )}

//         <div className="flex flex-col space-y-2 mt-4">
//           {["lineChartData", "barChartData", "scatterChartData", "pieChartData", "donutChartData"].map(
//             (type) => (
//               <button
//                 key={type}
//                 onClick={() => {
//                   setSelectedChart(type);
//                   setSelectedLabels([]);
//                 }}
//                 className="p-2 bg-gray-300 rounded hover:bg-gray-400"
//               >
//                 {type.replace("ChartData", " Chart")}
//               </button>
//             )
//           )}
//         </div>
//       </div>

//       <div className="w-full md:w-3/4 bg-gray-100 p-5 overflow-auto">
//         {loading ? (
//           <div className="flex justify-center items-center h-full">
//             <div className="spinner-border animate-spin border-t-4 border-blue-500 rounded-full w-12 h-12"></div>
//           </div>
//         ) : (
//           renderChart(selectedChart, {
//             lineChartData: Line,
//             barChartData: Bar,
//             scatterChartData: Scatter,
//             pieChartData: Pie,
//             donutChartData: Doughnut,
//           }[selectedChart])
//         )}
//       </div>
//     </div>
//   );
// }


// "use client";
// import { useState, useEffect } from "react";
// import { Bar, Line, Doughnut, Pie, Scatter } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { BsUpload } from "react-icons/bs";
// import zoomPlugin from "chartjs-plugin-zoom";
// import { log } from "node:console";
 
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
//   zoomPlugin
// );
 
// interface ChartData {
//   labels: string[];
//   datasets: {
//     label: string;
//     data: number[];
//     backgroundColor?: string;
//     borderColor?: string;
//     fill?: boolean;
//   }[];
// }
 
// export default function Dashboard() {
//   const [chartData, setChartData] = useState<Record<string, ChartData | null>>({
//     scatterChartData: null,
//     pieChartData: null,
//     donutChartData: null,
//     lineChartData: null,
//     barChartData: null,
//   });
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [selectedChart, setSelectedChart] = useState<string>("lineChartData");
//   const [loading, setLoading] = useState<boolean>(false);
//   const [chartWidth, setChartWidth] = useState<number>(0);
 
//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSelectedFile(event.target.files?.[0] || null);
//   };
 
//   const handleSubmit = async () => {
//     if (!selectedFile) return;
//     setLoading(true);
 
//     const formData = new FormData();
//     formData.append("file", selectedFile);
 
//     try {
//       const response = await fetch("http://localhost:3012/api/analyze-excel", {
//         method: "POST",
//         body: formData,
//       });
 
//       if (!response.ok) throw new Error("Error uploading file.");
//       const result = await response.json();
//       const processedData = result.data?.processedData;
// console.log("processedData",processedData);
 
//       if (!processedData) throw new Error("Invalid response structure.");
 
//       const generateChartData = (chartType: string): ChartData | null => {
//         const chartInfo = processedData[chartType]?.[0];
//         if (!chartInfo) return null;
 
//         const labels = Object.keys(chartInfo.data);
//         const values = Object.values(chartInfo.data);
//  console.log("labels.length ",chartType,labels.length );
//  console.log("values.length ",chartType,values.length );

 
//         setChartWidth(labels.length * 150);
 
//         return {
//           labels,
//           datasets: [
//             {
//               label: chartInfo.label || chartType,
//               data: values as number[],
//               backgroundColor: chartType.includes("Bar")
//                 ? "rgba(54, 162, 235, 0.5)"
//                 : "rgba(255, 99, 132, 0.5)",
//               borderColor: chartType.includes("Line")
//                 ? "rgba(255, 99, 132, 1)"
//                 : undefined,
//               fill: !chartType.includes("Line"),
//             },
//           ],
//         };
//       };
// console.log("generateChartData",generateChartData);
 
//       setChartData({
//         scatterChartData: generateChartData("Scatter Plot"),
//         pieChartData: generateChartData("Pie Chart"),
//         donutChartData: generateChartData("Donut Chart"),
//         lineChartData: generateChartData("Line Chart"),
//         barChartData: generateChartData("Bar Chart"),
//       });
//     } catch (error) {
//       console.error("Error uploading file:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
 
//   const getChartOptions = (type: string) => ({
   
//     responsive: true,
//     maintainAspectRatio: false,
//     scales: ["pieChartData", "donutChartData"].includes(type)
//       ? {}
//       : {
//         x: {
//           ticks: {
//             autoSkip: false,
//             maxRotation: type === 'barChartData' || type === 'scatterChartData' ? 20 : 100,
//         minRotation: type === 'barChartData' || type === 'scatterChartData' ? 0 : 90,
//             autoSkipPadding: 20,
//           },
//           grid: {
//             display: true,
//             drawTicks: false,
//             tickLength: 100,
//             lineWidth: 1
//           },
//         },
//           y: {
//             beginAtZero: true,
//             ticks: {
//               precision: 0,
//             },
//           },
//         },
//     plugins: {
//       legend: {
//         display: true,
//         position: "top",
//       },
//       tooltip: {
//         enabled: true,
//       },
//     },
//   });
 
//   const renderChart = (type: string, ChartComponent: any) => {
//     const data = chartData[type];
//     if (!loading && data) {
//       return (
//         <div className="card p-4 border rounded shadow-sm">
//           <div style={{ width: "100%", overflowX: "auto" }}>
//             <div
//               style={{
//                 minWidth: ["lineChartData", "barChartData"].includes(type)
//                   ? `${chartWidth}px`
//                   : "auto",
//                 height: "400px",
//               }}
//             >
//               <ChartComponent data={data} options={getChartOptions(type)} />
//             </div>
//           </div>
//         </div>
//       );
//     }
//     return null;
//   };
 
//   return (
//     <div className="flex flex-col md:flex-row h-screen border border-black">
//       <div className="w-full md:w-1/4 bg-white p-5 border-t md:border-l md:border-black">
//         <h2 className="text-lg font-bold mb-2">Upload File</h2>
//         <input type="file" onChange={handleFileChange} className="border p-2 w-full" />
//         <button
//           onClick={handleSubmit}
//           className="bg-blue-500 text-white p-2 rounded flex items-center justify-center mt-4"
//         >
//           <BsUpload className="mr-2" /> Submit
//         </button>
//         <div className="flex flex-col space-y-2 mt-4">
//           {["lineChartData", "barChartData", "scatterChartData", "pieChartData", "donutChartData"].map(
//             (type) => (
//               <button
//                 key={type}
//                 onClick={() => setSelectedChart(type)}
//                 className="p-2 bg-gray-300 rounded hover:bg-gray-400"
//               >
//                 {type.replace("ChartData", " Chart")}
//               </button>
//             )
//           )}
//         </div>
//       </div>
 
//       <div className="w-full md:w-3/4 bg-gray-100 p-5 overflow-auto">
//         {loading ? (
//           <div className="flex justify-center items-center h-full">
//             <div className="spinner-border animate-spin border-t-4 border-blue-500 rounded-full w-12 h-12"></div>
//           </div>
//         ) : (
//           renderChart(selectedChart, {
//             lineChartData: Line,
//             barChartData: Bar,
//             scatterChartData: Scatter,
//             pieChartData: Pie,
//             donutChartData: Doughnut,
//           }[selectedChart])
//         )}
//       </div>
//     </div>
//   );
// }


// "use client";
// import { useState, useEffect } from "react";
// import { Bar, Line, Doughnut, Pie, Scatter } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { BsUpload } from "react-icons/bs";
// import zoomPlugin from "chartjs-plugin-zoom";
// import { log } from "node:console";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
//   zoomPlugin
// );

// interface ChartData {
//   labels: string[];
//   datasets: {
//     label: string;
//     data: number[];
//     backgroundColor?: string | string[];
//     borderColor?: string;
//     fill?: boolean;
//   }[];
// }

// export default function Dashboard() {
//   const [chartData, setChartData] = useState<Record<string, ChartData | null>>({
//     scatterChartData: null,
//     pieChartData: null,
//     donutChartData: null,
//     lineChartData: null,
//     barChartData: null,
//   });
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [selectedChart, setSelectedChart] = useState<string>("lineChartData");
//   const [loading, setLoading] = useState<boolean>(false);
//   const [chartWidth, setChartWidth] = useState<number>(0);

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSelectedFile(event.target.files?.[0] || null);
//   };

//   const handleSubmit = async () => {
//     if (!selectedFile) return;
//     setLoading(true);

//     const formData = new FormData();
//     formData.append("file", selectedFile);

//     try {
//       const response = await fetch("http://localhost:3012/api/analyze-excel", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) throw new Error("Error uploading file.");
//       const result = await response.json();
//       const processedData = result.data?.processedData;

//       if (!processedData) throw new Error("Invalid response structure.");

//       const lightColors = [
//         "rgba(173, 216, 230, 0.6)",
//         "rgba(144, 238, 144, 0.6)",
//         "rgba(255, 182, 193, 0.6)",
//         "rgba(255, 228, 181, 0.6)",
//         "rgba(221, 160, 221, 0.6)",
//         "rgba(240, 230, 140, 0.6)",
//       ];

//       const generateChartData = (chartType: string): ChartData | null => {
//         const chartInfo = processedData[chartType]?.[0];
//         if (!chartInfo) return null;

//         const labels = Object.keys(chartInfo.data);
//         const values = Object.values(chartInfo.data);

//         setChartWidth(labels.length * 150);

//         return {
//           labels,
//           datasets: [
//             {
//               label: chartInfo.label || chartType,
//               data: values as number[],
//               backgroundColor: ["Pie Chart", "Donut Chart", "Bar Chart"].includes(chartType)
//                 ? lightColors.slice(0, labels.length)
//                 : "rgba(135, 206, 250, 0.6)",
//               borderColor: chartType.includes("Line")
//                 ? "rgba(135, 206, 250, 1)"
//                 : undefined,
//               fill: !chartType.includes("Line"),
//             },
//           ],
//         };
//       };

//       setChartData({
//         scatterChartData: generateChartData("Scatter Plot"),
//         pieChartData: generateChartData("Pie Chart"),
//         donutChartData: generateChartData("Donut Chart"),
//         lineChartData: generateChartData("Line Chart"),
//         barChartData: generateChartData("Bar Chart"),
//       });
//     } catch (error) {
//       console.error("Error uploading file:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getChartOptions = (type: string) => ({
//     responsive: true,
//     maintainAspectRatio: false,
//     scales: ["pieChartData", "donutChartData"].includes(type)
//       ? {}
//       : {
        // x: {
        //   ticks: {
        //     autoSkip: false,
        //     maxRotation: type === 'barChartData' || type === 'scatterChartData' ? 20 : 100,
        // minRotation: type === 'barChartData' || type === 'scatterChartData' ? 0 : 90,
        //     autoSkipPadding: 20,
        //   },
        //   grid: {
        //     display: true,
        //     drawTicks: false,
        //     tickLength: 100,
        //     lineWidth: 1
        //   },
        // },
//           y: {
//             beginAtZero: true,
//             ticks: {
//               precision: 0,
//             },
//           },
//         },
//     plugins: {
//       legend: {
//         display: true,
//         position: "top",
//       },
//       tooltip: {
//         enabled: true,
//       },
//     },
//   });

//   const renderChart = (type: string, ChartComponent: any) => {
//     const data = chartData[type];
//     if (!loading && data) {
//       return (
//         <div className="card p-4 border rounded shadow-sm">
//           <div style={{ width: "100%", overflowX: "auto" }}>
//             <div
//               style={{
//                 minWidth: ["lineChartData", "barChartData"].includes(type)
//                   ? `${chartWidth}px`
//                   : "auto",
//                 height: "400px",
//               }}
//             >
//               <ChartComponent data={data} options={getChartOptions(type)} />
//             </div>
//           </div>
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="flex flex-col md:flex-row h-screen border border-black">
//       <div className="w-full md:w-1/4 bg-white p-5 border-t md:border-l md:border-black">
//         <h2 className="text-lg font-bold mb-2">Upload File</h2>
//         <input type="file" onChange={handleFileChange} className="border p-2 w-full" />
//         <button
//           onClick={handleSubmit}
//           className="bg-blue-500 text-white p-2 rounded flex items-center justify-center mt-4"
//         >
//           <BsUpload className="mr-2" /> Submit
//         </button>
//         <div className="flex flex-col space-y-2 mt-4">
//           {["lineChartData", "barChartData", "scatterChartData", "pieChartData", "donutChartData"].map(
//             (type) => (
//               <button
//                 key={type}
//                 onClick={() => setSelectedChart(type)}
//                 className="p-2 bg-gray-300 rounded hover:bg-gray-400"
//               >
//                 {type.replace("ChartData", " Chart")}
//               </button>
//             )
//           )}
//         </div>
//       </div>

//       <div className="w-full md:w-3/4 bg-gray-100 p-5 overflow-auto">
//         {loading ? (
//           <div className="flex justify-center items-center h-full">
//             <div className="spinner-border animate-spin border-t-4 border-blue-500 rounded-full w-12 h-12"></div>
//           </div>
//         ) : (
//           renderChart(selectedChart, {
//             lineChartData: Line,
//             barChartData: Bar,
//             scatterChartData: Scatter,
//             pieChartData: Pie,
//             donutChartData: Doughnut,
//           }[selectedChart])
//         )}
//       </div>
//     </div>
//   );
// }


// "use client";
// import { useState, useEffect } from "react";
// import { Bar, Line, Doughnut, Pie, Scatter } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { BsUpload } from "react-icons/bs";
// import zoomPlugin from "chartjs-plugin-zoom";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
//   zoomPlugin
// );

// interface ChartData {
//   labels: string[];
//   datasets: {
//     label: string;
//     data: number[];
//     backgroundColor?: string | string[];
//     borderColor?: string;
//     fill?: boolean;
//   }[];
// }

// export default function Dashboard() {
//   const [chartData, setChartData] = useState<Record<string, ChartData | null>>({
//     scatterChartData: null,
//     pieChartData: null,
//     donutChartData: null,
//     lineChartData: null,
//     barChartData: null,
//   });
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [selectedChart, setSelectedChart] = useState<string>("lineChartData");
//   const [loading, setLoading] = useState<boolean>(false);
//   const [chartWidth, setChartWidth] = useState<number>(0);
//   const [inputValue, setInputValue] = useState<string>("");

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSelectedFile(event.target.files?.[0] || null);
//   };

//   const handleSubmit = async () => {
//     if (!selectedFile) return;
//     setLoading(true);

//     const formData = new FormData();
//     formData.append("file", selectedFile);

//     try {
//       const response = await fetch("http://localhost:3012/api/analyze-excel", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) throw new Error("Error uploading file.");
//       const result = await response.json();
//       const processedData = result.data?.processedData;

//       if (!processedData) throw new Error("Invalid response structure.");

//       const lightColors = [
//         "rgba(173, 216, 230, 0.6)",
//         "rgba(144, 238, 144, 0.6)",
//         "rgba(255, 182, 193, 0.6)",
//         "rgba(255, 228, 181, 0.6)",
//         "rgba(221, 160, 221, 0.6)",
//         "rgba(240, 230, 140, 0.6)",
//       ];

//       const generateChartData = (chartType: string): ChartData | null => {
//         const chartInfo = processedData[chartType]?.[0];
//         if (!chartInfo) return null;

//         const labels = Object.keys(chartInfo.data);
//         const values = Object.values(chartInfo.data);

//         setChartWidth(labels.length * 150);

//         return {
//           labels,
//           datasets: [
//             {
//               label: chartInfo.label || chartType,
//               data: values as number[],
//               backgroundColor: ["Pie Chart", "Donut Chart", "Bar Chart"].includes(chartType)
//                 ? lightColors.slice(0, labels.length)
//                 : "rgba(135, 206, 250, 0.6)",
//               borderColor: chartType.includes("Line")
//                 ? "rgba(135, 206, 250, 1)"
//                 : undefined,
//               fill: !chartType.includes("Line"),
//             },
//           ],
//         };
//       };

//       setChartData({
//         scatterChartData: generateChartData("Scatter Plot"),
//         pieChartData: generateChartData("Pie Chart"),
//         donutChartData: generateChartData("Donut Chart"),
//         lineChartData: generateChartData("Line Chart"),
//         barChartData: generateChartData("Bar Chart"),
//       });
//     } catch (error) {
//       console.error("Error uploading file:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSend = () => {
//     console.log("Input Value:", inputValue);
//   };

//   const getChartOptions = (type: string) => ({
//     responsive: true,
//     maintainAspectRatio: false,
//     scales: ["pieChartData", "donutChartData"].includes(type)
//       ? {}
//       : {
//         x: {
//           ticks: {
//             autoSkip: false,
//             maxRotation: type === 'barChartData' || type === 'scatterChartData' ? 20 : 100,
//         minRotation: type === 'barChartData' || type === 'scatterChartData' ? 0 : 90,
//             autoSkipPadding: 20,
//           },
//           grid: {
//             display: true,
//             drawTicks: false,
//             tickLength: 100,
//             lineWidth: 1
//           },
//         },
//           y: {
//             beginAtZero: true,
//             ticks: {
//               precision: 0,
//             },
//           },
//         },
//     plugins: {
//       legend: {
//         display: true,
//         position: "top",
//       },
//       tooltip: {
//         enabled: true,
//       },
//     },
//   });

//   const renderChart = (type: string, ChartComponent: any) => {
//     const data = chartData[type];
//     if (!loading && data) {
//       return (
//         <div className="card p-4 border rounded shadow-sm">
//           <div style={{ width: "100%", overflowX: "auto" }}>
//             <div
//               style={{
//                 minWidth: ["lineChartData", "barChartData"].includes(type)
//                   ? `${chartWidth}px`
//                   : "auto",
//                 height: "400px",
//               }}
//             >
//               <ChartComponent data={data} options={getChartOptions(type)} />
//             </div>
//           </div>
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="flex flex-col md:flex-row h-screen border border-black">
//       <div className="w-full md:w-1/4 bg-white p-5 border-t md:border-l md:border-black">
//         <h2 className="text-lg font-bold mb-2">Upload File</h2>
//         <input type="file" onChange={handleFileChange} className="border p-2 w-full" />
//         <button
//           onClick={handleSubmit}
//           className="bg-blue-500 text-white p-2 rounded flex items-center justify-center mt-4"
//         >
//           <BsUpload className="mr-2" /> Submit
//         </button>
//         <div className="flex flex-col space-y-2 mt-4">
//           {["lineChartData", "barChartData", "scatterChartData", "pieChartData", "donutChartData"].map(
//             (type) => (
//               <button
//                 key={type}
//                 onClick={() => setSelectedChart(type)}
//                 className="p-2 bg-gray-300 rounded hover:bg-gray-400"
//               >
//                 {type.replace("ChartData", " Chart")}
//               </button>
//             )
//           )}
//         </div>
//       </div>

//       <div className="w-full md:w-3/4 bg-gray-100 p-5 overflow-auto">
//         {loading ? (
//           <div className="flex justify-center items-center h-full">
//             <div className="spinner-border animate-spin border-t-4 border-blue-500 rounded-full w-12 h-12"></div>
//           </div>
//         ) : (
//           renderChart(selectedChart, {
//             lineChartData: Line,
//             barChartData: Bar,
//             scatterChartData: Scatter,
//             pieChartData: Pie,
//             donutChartData: Doughnut,
//           }[selectedChart])
//         )}

//         <div className="mt-4 flex">
//           <input
//             type="text"
//             value={inputValue}
//             onChange={(e) => setInputValue(e.target.value)}
//             className="border p-2 flex-grow mr-2 rounded"
//             placeholder="Enter your text here"
//           />
//           <button
//             onClick={handleSend}
//             className="bg-green-500 text-white p-2 rounded"
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



// "use client";
// import { useState, useEffect } from "react";
// import { Bar, Line, Doughnut, Pie, Scatter } from "react-chartjs-2";
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
// import { BsUpload } from "react-icons/bs";
// import zoomPlugin from "chartjs-plugin-zoom";

// ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, zoomPlugin);

// interface ChartData {
//   labels: string[];
//   datasets: {
//     label: string;
//     data: number[];
//     backgroundColor?: string | string[];
//     borderColor?: string;
//     fill?: boolean;
//   }[]
//   meta?: {
//     header: string;
//     valueName: string;
//   };
// }

// export default function Dashboard() {
//   const [chartData, setChartData] = useState<Record<string, ChartData | null>>({
//     scatterChartData: null,
//     pieChartData: null,
//     donutChartData: null,
//     lineChartData: null,
//     barChartData: null,
//   });
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [selectedChart, setSelectedChart] = useState<string>("lineChartData");
//   const [loading, setLoading] = useState<boolean>(false);
//   const [chartWidth, setChartWidth] = useState<number>(0);
//   const [inputValue, setInputValue] = useState<string>("");
//   const [storedProcessedData, setStoredProcessedData] = useState<any>(null); // New state to store processed data
//   const [combinedInsights, setCombinedInsights] = useState<any>(null);

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSelectedFile(event.target.files?.[0] || null);
//   };

//   const handleSubmit = async () => {
//     if (!selectedFile) return;
//     setLoading(true);

//     const formData = new FormData();
//     formData.append("file", selectedFile);

//     try {
//       const response = await fetch("http://localhost:3012/api/analyze-excel", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) throw new Error("Error uploading file.");
//       const result = await response.json();
//       const combinedInsights = result.data?.combinedInsights;
//       const processedData = result.data?.processedData;

//       if (!processedData) throw new Error("Invalid response structure.");
// console.log("processedData",processedData);

//       setStoredProcessedData(processedData); // Store the processed data
//       setCombinedInsights(combinedInsights);
//       const lightColors = [
//         "rgba(173, 216, 230, 0.6)",
//         "rgba(144, 238, 144, 0.6)",
//         "rgba(255, 182, 193, 0.6)",
//         "rgba(255, 228, 181, 0.6)",
//         "rgba(221, 160, 221, 0.6)",
//         "rgba(240, 230, 140, 0.6)",
//       ];

//       const generateChartData = (chartType: string): ChartData | null => {
//         const chartInfo = processedData[chartType]?.[0];
//         if (!chartInfo) return null;

//         const labels = Object.keys(chartInfo.data);
//         const values = Object.values(chartInfo.data);

//         setChartWidth(labels.length * 150);

//         return {
//           labels,
//           datasets: [
//             {
//               label: chartInfo.label || chartType,
//               data: values as number[],
//               backgroundColor: ["Pie Chart", "Donut Chart", "Bar Chart"].includes(chartType)
//                 ? lightColors.slice(0, labels.length)
//                 : "rgba(135, 206, 250, 0.6)",
//               borderColor: chartType.includes("Line") ? "rgba(135, 206, 250, 1)" : undefined,
//               fill: !chartType.includes("Line"),
//             },
//           ],
//           meta: {
//             header: chartInfo.header || "default_header",
//             valueName: chartInfo.valueName || "default_valueName",
//           },
//         };
//       };

//       setChartData({
//         scatterChartData: generateChartData("Scatter Plot"),
//         pieChartData: generateChartData("Pie Chart"),
//         donutChartData: generateChartData("Donut Chart"),
//         lineChartData: generateChartData("Line Chart"),
//         barChartData: generateChartData("Bar Chart"),
//       });
//     } catch (error) {
//       console.error("Error uploading file:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

 
//   const handleSend = async () => {
//     if (!inputValue) return;
  
//     const graphData = chartData[selectedChart];
//     if (!graphData) return;
  
//     const labels = graphData.labels;
//     const values = graphData.datasets[0].data;
  
//     const dataObject = labels.reduce((obj: { [key: string]: number }, label, index) => {
//       obj[label] = values[index];
//       return obj;
//     }, {});
  
//     const chartTypeMapping: Record<string, string> = {
//       lineChartData: "Line Chart",
//       pieChartData: "Pie Chart",
//       donutChartData: "Donut Chart",
//       barChartData: "Bar Chart",
//       scatterChartData: "Scatter Plot",
//     };
  
//     const selectedChartType = chartTypeMapping[selectedChart] || selectedChart;
  
//     // Filter the stored processed data to include only the selected chart's data
//     const filteredProcessedData = {
//       [selectedChartType]: storedProcessedData[selectedChartType],
//     };
  
//     console.log("...filteredProcessedData,", filteredProcessedData[selectedChartType]?.[0]?.data);
//     console.log("dataObject,", dataObject);
  
//     const requestBody = {
//       question: inputValue,
//       processedData: {
//         // Include the stored processed data
//         [selectedChartType]: [
//           {
//             header: graphData.meta?.header || "default_header",
//             valueName: graphData.meta?.valueName || "default_valueName",
//             label: graphData.datasets[0].label,
//             data: filteredProcessedData[selectedChartType]?.[0]?.data,
//           },
//         ],
//       },
//     };
  
//     try {
//       const response = await fetch(
//         `http://localhost:3012/api/answer-analyze-excel?question=${encodeURIComponent(inputValue)}`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(requestBody),
//         }
//       );
  
//       if (!response.ok) throw new Error("Error uploading file.");
//       const result = await response.json();
//       const processedData = result.data?.processedData;
  
//       if (!processedData) throw new Error("Invalid response structure.");
  
//       console.log("Updated API Response Data:", processedData);
  
//       const generateChartData = (chartType: string): ChartData | null => {
//         const chartInfo = processedData[chartType]?.[0]; // Use only API response data
//         if (!chartInfo) return null;
  
//         const labels = Object.keys(chartInfo.data);
//         const values = Object.values(chartInfo.data);
  
//         setChartWidth(labels.length * 150);
  
//         return {
//           labels,
//           datasets: [
//             {
//               label: chartInfo.label || chartType,
//               data: values as number[],
//               backgroundColor: ["Pie Chart", "Donut Chart", "Bar Chart"].includes(chartType)
//                 ? ["rgba(173, 216, 230, 0.6)", "rgba(144, 238, 144, 0.6)", "rgba(255, 182, 193, 0.6)"]
//                 : "rgba(135, 206, 250, 0.6)",
//               borderColor: chartType.includes("Line") ? "rgba(135, 206, 250, 1)" : undefined,
//               fill: !chartType.includes("Line"),
//             },
//           ],
//           meta: {
//             header: chartInfo.header || "default_header",
//             valueName: chartInfo.valueName || "default_valueName",
//           },
//         };
//       };
  
//       // Only update chartData without storing in storedProcessedData
//       setChartData((prevChartData) => ({
//         ...prevChartData,
//         [selectedChart]: generateChartData(selectedChartType),
//       }));
//     } catch (error) {
//       console.error("Error sending request:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   const getChartOptions = (type: string) => ({
//     responsive: true,
//     maintainAspectRatio: false,
//     scales: ["pieChartData", "donutChartData"].includes(type)
//       ? {}
//       : {
//         x: {
//           ticks: {
//             autoSkip: false,
//             maxRotation: type === 'barChartData' || type === 'scatterChartData' ? 20 : 100,
//         minRotation: type === 'barChartData' || type === 'scatterChartData' ? 0 : 90,
//             autoSkipPadding: 20,
//           },
//           grid: {
//             display: true,
//             drawTicks: false,
//             tickLength: 100,
//             lineWidth: 1
//           },
//         },
//         y: {
//           beginAtZero: true,
//           ticks: { precision: 0 },
//         },
//       },
//     plugins: {
//       legend: { display: true, position: "top" },
//       tooltip: { enabled: true },
//     },
//   });

//   const renderChart = (type: string, ChartComponent: any) => {
//     const data = chartData[type];
//     if (!loading && data) {
//       return (
//         <div className="card p-4 border rounded shadow-sm">
//           <div style={{ width: "100%", overflowX: "auto" }}>
//             <div style={{ minWidth: ["lineChartData", "barChartData"].includes(type) ? `${chartWidth}px` : "auto", height: "400px" }}>
//               <ChartComponent data={data} options={getChartOptions(type)} />
//             </div>
//           </div>
//         </div>
//       );
//     }
//     return null;
//   };
//   return (
//     <div className="flex flex-col md:flex-row h-screen border border-black">
//       <div className="w-full md:w-1/4 bg-white p-5 border-t md:border-l md:border-black">
//         <h2 className="text-lg font-bold mb-2">Upload File</h2>
//         <input type="file" onChange={handleFileChange} className="border p-2 w-full" />
//         <button onClick={handleSubmit} className="bg-blue-500 text-white p-2 rounded flex items-center justify-center mt-4">
//           <BsUpload className="mr-2" /> Submit
//         </button>
//         <div className="flex flex-col space-y-2 mt-4">
//           {["lineChartData", "barChartData", "scatterChartData", "pieChartData", "donutChartData"].map((type) => (
//             <button key={type} onClick={() => setSelectedChart(type)} className="p-2 bg-gray-300 rounded hover:bg-gray-400">
//               {type.replace("ChartData", " Chart")}
//             </button>
//           ))}
//         </div>
//       </div>
//       <div className="w-full md:w-3/4 bg-gray-100 p-5 overflow-auto">
//         {loading ? (
//           <div className="flex justify-center items-center h-full">
//             <div className="spinner-border animate-spin border-t-4 border-blue-500 rounded-full w-12 h-12"></div>
//           </div>
//         ) : (
//           selectedChart && renderChart(selectedChart, { lineChartData: Line, barChartData: Bar, scatterChartData: Scatter, pieChartData: Pie, donutChartData: Doughnut }[selectedChart])
//         )}
//         <div className="mt-4 flex">
//           <input
//             type="text"
//             value={inputValue}
//             onChange={(e) => setInputValue(e.target.value)}
//             className="border p-2 flex-grow mr-2 rounded"
//             placeholder="Enter your text here"
//           />
//           <button onClick={handleSend} className="bg-green-500 text-white p-2 rounded">
//             Send
//           </button>
//         </div>
//         <div className="mt-4 p-4 border border-gray-300 rounded bg-white">
//         <h3 className="text-lg font-bold mb-2">Insights</h3>
//         {combinedInsights ? (
//             <ol className="list-decimal list-inside text-sm text-gray-700 bg-gray-100 p-2 rounded overflow-auto">
//             {combinedInsights.split('\n').map((insight, index) => (
//               <ul key={index}>{insight}</ul>
//             ))}
//           </ol>
//         ) : (
//           <p className="text-gray-500">No insights available.</p>
//         )}
//       </div>
//       </div>
//     </div>
//   );
// }

// "use client";
// import { useState, useEffect, useRef } from "react";
// import { Bar, Line, Doughnut, Pie, Scatter } from "react-chartjs-2";
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
// import { BsUpload } from "react-icons/bs";
// import zoomPlugin from "chartjs-plugin-zoom";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, zoomPlugin);

// interface ChartData {
//   labels: string[];
//   datasets: {
//     label: string;
//     data: number[];
//     backgroundColor?: string | string[];
//     borderColor?: string;
//     fill?: boolean;
//   }[]
//   meta?: {
//     header: string;
//     valueName: string;
//   };
// }

// export default function Dashboard() {
//   const [chartData, setChartData] = useState<Record<string, ChartData | null>>({
//     scatterChartData: null,
//     pieChartData: null,
//     donutChartData: null,
//     lineChartData: null,
//     barChartData: null,
//   });
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [selectedChart, setSelectedChart] = useState<string>("lineChartData");
//   const [loading, setLoading] = useState<boolean>(false);
//   const [chartWidth, setChartWidth] = useState<number>(0);
//   const [inputValue, setInputValue] = useState<string>("");
//   const [storedProcessedData, setStoredProcessedData] = useState<any>(null); // New state to store processed data
//   const [combinedInsights, setCombinedInsights] = useState<any>(null);
//   const chartRef = useRef<HTMLDivElement>(null); // Ref for the chart container

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSelectedFile(event.target.files?.[0] || null);
//   };

//   const handleSubmit = async () => {
//     if (!selectedFile) return;
//     setLoading(true);

//     const formData = new FormData();
//     formData.append("file", selectedFile);

//     try {
//       const response = await fetch("http://localhost:3012/api/analyze-excel", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) throw new Error("Error uploading file.");
//       const result = await response.json();
//       const combinedInsights = result.data?.combinedInsights;
//       const processedData = result.data?.processedData;

//       if (!processedData) throw new Error("Invalid response structure.");
// console.log("processedData",processedData);

//       setStoredProcessedData(processedData); // Store the processed data
//       setCombinedInsights(combinedInsights);
//       const lightColors = [
//         "rgba(173, 216, 230, 0.6)",
//         "rgba(144, 238, 144, 0.6)",
//         "rgba(255, 182, 193, 0.6)",
//         "rgba(255, 228, 181, 0.6)",
//         "rgba(221, 160, 221, 0.6)",
//         "rgba(240, 230, 140, 0.6)",
//       ];

//       const generateChartData = (chartType: string): ChartData | null => {
//         const chartInfo = processedData[chartType]?.[0];
//         if (!chartInfo) return null;

//         const labels = Object.keys(chartInfo.data);
//         const values = Object.values(chartInfo.data);

//         setChartWidth(labels.length * 150);

//         return {
//           labels,
//           datasets: [
//             {
//               label: chartInfo.label || chartType,
//               data: values as number[],
//               backgroundColor: ["Pie Chart", "Donut Chart", "Bar Chart"].includes(chartType)
//                 ? lightColors.slice(0, labels.length)
//                 : "rgba(135, 206, 250, 0.6)",
//               borderColor: chartType.includes("Line") ? "rgba(135, 206, 250, 1)" : undefined,
//               fill: !chartType.includes("Line"),
//             },
//           ],
//           meta: {
//             header: chartInfo.header || "default_header",
//             valueName: chartInfo.valueName || "default_valueName",
//           },
//         };
//       };

//       setChartData({
//         scatterChartData: generateChartData("Scatter Plot"),
//         pieChartData: generateChartData("Pie Chart"),
//         donutChartData: generateChartData("Donut Chart"),
//         lineChartData: generateChartData("Line Chart"),
//         barChartData: generateChartData("Bar Chart"),
//       });
//     } catch (error) {
//       console.error("Error uploading file:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

 
//   const handleSend = async () => {
//     if (!inputValue) return;
  
//     const graphData = chartData[selectedChart];
//     if (!graphData) return;
  
//     const labels = graphData.labels;
//     const values = graphData.datasets[0].data;
  
//     const dataObject = labels.reduce((obj: { [key: string]: number }, label, index) => {
//       obj[label] = values[index];
//       return obj;
//     }, {});
  
//     const chartTypeMapping: Record<string, string> = {
//       lineChartData: "Line Chart",
//       pieChartData: "Pie Chart",
//       donutChartData: "Donut Chart",
//       barChartData: "Bar Chart",
//       scatterChartData: "Scatter Plot",
//     };
  
//     const selectedChartType = chartTypeMapping[selectedChart] || selectedChart;
  
//     // Filter the stored processed data to include only the selected chart's data
//     const filteredProcessedData = {
//       [selectedChartType]: storedProcessedData[selectedChartType],
//     };
  
//     console.log("...filteredProcessedData,", filteredProcessedData[selectedChartType]?.[0]?.data);
//     console.log("dataObject,", dataObject);
  
//     const requestBody = {
//       question: inputValue,
//       processedData: {
//         // Include the stored processed data
//         [selectedChartType]: [
//           {
//             header: graphData.meta?.header || "default_header",
//             valueName: graphData.meta?.valueName || "default_valueName",
//             label: graphData.datasets[0].label,
//             data: filteredProcessedData[selectedChartType]?.[0]?.data,
//           },
//         ],
//       },
//     };
  
//     try {
//       const response = await fetch(
//         `http://localhost:3012/api/answer-analyze-excel?question=${encodeURIComponent(inputValue)}`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(requestBody),
//         }
//       );
  
//       if (!response.ok) throw new Error("Error uploading file.");
//       const result = await response.json();
//       const processedData = result.data?.processedData;
  
//       if (!processedData) throw new Error("Invalid response structure.");
  
//       console.log("Updated API Response Data:", processedData);
  
//       const generateChartData = (chartType: string): ChartData | null => {
//         const chartInfo = processedData[chartType]?.[0]; // Use only API response data
//         if (!chartInfo) return null;
  
//         const labels = Object.keys(chartInfo.data);
//         const values = Object.values(chartInfo.data);
  
//         setChartWidth(labels.length * 150);
  
//         return {
//           labels,
//           datasets: [
//             {
//               label: chartInfo.label || chartType,
//               data: values as number[],
//               backgroundColor: ["Pie Chart", "Donut Chart", "Bar Chart"].includes(chartType)
//                 ? ["rgba(173, 216, 230, 0.6)", "rgba(144, 238, 144, 0.6)", "rgba(255, 182, 193, 0.6)"]
//                 : "rgba(135, 206, 250, 0.6)",
//               borderColor: chartType.includes("Line") ? "rgba(135, 206, 250, 1)" : undefined,
//               fill: !chartType.includes("Line"),
//             },
//           ],
//           meta: {
//             header: chartInfo.header || "default_header",
//             valueName: chartInfo.valueName || "default_valueName",
//           },
//         };
//       };
  
//       // Only update chartData without storing in storedProcessedData
//       setChartData((prevChartData) => ({
//         ...prevChartData,
//         [selectedChart]: generateChartData(selectedChartType),
//       }));
//     } catch (error) {
//       console.error("Error sending request:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   const getChartOptions = (type: string) => ({
//     responsive: true,
//     maintainAspectRatio: false,
//     scales: ["pieChartData", "donutChartData"].includes(type)
//       ? {}
//       : {
//         x: {
//           ticks: {
//             autoSkip: false,
//             maxRotation: type === 'barChartData' || type === 'scatterChartData' ? 20 : 100,
//         minRotation: type === 'barChartData' || type === 'scatterChartData' ? 0 : 90,
//             autoSkipPadding: 20,
//           },
//           grid: {
//             display: true,
//             drawTicks: false,
//             tickLength: 100,
//             lineWidth: 1
//           },
//         },
//         y: {
//           beginAtZero: true,
//           ticks: { precision: 0 },
//         },
//       },
//     plugins: {
//       legend: { display: true, position: "top" },
//       tooltip: { enabled: true },
//     },
//   });
//   const renderChart = (type: string, ChartComponent: any) => {
//     const data = chartData[type];
//     if (!loading && data) {
//       return (
//         <div className="card p-4 border rounded shadow-sm">
//           <div style={{ width: "100%", overflowX: "auto" }}>
//             <div style={{ minWidth: ["lineChartData", "barChartData"].includes(type) ? `${chartWidth}px` : "auto", height: "400px" }}>
//               <ChartComponent data={data} options={getChartOptions(type)} />
//             </div>
//           </div>
//         </div>
//       );
//     }
//     return null;
//   };

//   const handleDownloadPDF = async () => {
//     if (!chartRef.current) return;
  
//     // Temporarily set the chart container to its full height to capture all content
//     const originalHeight = chartRef.current.style.height;
//     chartRef.current.style.height = `${chartRef.current.scrollHeight}px`;
  
//     const canvas = await html2canvas(chartRef.current, {
//       scrollX: 0,
//       scrollY: -window.scrollY,
//       width: chartRef.current.scrollWidth,
//       height: chartRef.current.scrollHeight,
//     });
  
//     // Restore the original height of the chart container
//     chartRef.current.style.height = originalHeight;
  
//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF("landscape", "mm", "a4");
//     const imgProps = pdf.getImageProperties(imgData);
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
//     pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//     pdf.save("chart.pdf");
//   };

//   return (
//     <div className="flex flex-col md:flex-row h-screen border border-black">
//       <div className="w-full md:w-1/4 bg-white p-5 border-t md:border-l md:border-black">
//         <h2 className="text-lg font-bold mb-2">Upload File</h2>
//         <input type="file" onChange={handleFileChange} className="border p-2 w-full" />
//         <button onClick={handleSubmit} className="bg-blue-500 text-white p-2 rounded flex items-center justify-center mt-4">
//           <BsUpload className="mr-2" /> Submit
//         </button>
//         <div className="flex flex-col space-y-2 mt-4">
//           {["lineChartData", "barChartData", "scatterChartData", "pieChartData", "donutChartData"].map((type) => (
//             <button key={type} onClick={() => setSelectedChart(type)} className="p-2 bg-gray-300 rounded hover:bg-gray-400">
//               {type.replace("ChartData", " Chart")}
//             </button>
//           ))}
//         </div>
//       </div>
//       <div className="w-full md:w-3/4 bg-gray-100 p-5 overflow-auto">
//         {loading ? (
//           <div className="flex justify-center items-center h-full">
//             <div className="spinner-border animate-spin border-t-4 border-blue-500 rounded-full w-12 h-12"></div>
//           </div>
//         ) : (
//           selectedChart && renderChart(selectedChart, { lineChartData: Line, barChartData: Bar, scatterChartData: Scatter, pieChartData: Pie, donutChartData: Doughnut }[selectedChart])
//         )}
//         <div className="mt-4 flex">
//           <input
//             type="text"
//             value={inputValue}
//             onChange={(e) => setInputValue(e.target.value)}
//             className="border p-2 flex-grow mr-2 rounded"
//             placeholder="Enter your text here"
//           />
//           <button onClick={handleSend} className="bg-green-500 text-white p-2 rounded">
//             Send
//           </button>
//         </div>
//         <div className="mt-4 p-4 border border-gray-300 rounded bg-white">
//           <h3 className="text-lg font-bold mb-2">Insights</h3>
//           {combinedInsights ? (
//             <ol className="list-decimal list-inside text-sm text-gray-700 bg-gray-100 p-2 rounded overflow-auto">
//               {combinedInsights.split('\n').map((insight, index) => (
//                 <ul key={index}>{insight}</ul>
//               ))}
//             </ol>
//           ) : (
//             <p className="text-gray-500">No insights available.</p>
//           )}
//         </div>
//         <button onClick={handleDownloadPDF} className="bg-red-500 text-white p-2 rounded mt-4">
//           Download as PDF
//         </button>
//       </div>
//     </div>
//   );
// }



"use client";
import { useState, useEffect, useRef } from "react";
import { Bar, Line, Doughnut, Pie, Scatter } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import { BsUpload } from "react-icons/bs";
import zoomPlugin from "chartjs-plugin-zoom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, zoomPlugin);

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    fill?: boolean;
  }[]
  meta?: {
    header: string;
    valueName: string;
  };
}

export default function Dashboard() {
  const [chartData, setChartData] = useState<Record<string, ChartData | null>>({
    scatterChartData: null,
    pieChartData: null,
    donutChartData: null,
    lineChartData: null,
    barChartData: null,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedChart, setSelectedChart] = useState<string>("lineChartData");
  const [loading, setLoading] = useState<boolean>(false);
  const [chartWidth, setChartWidth] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>("");
  const [storedProcessedData, setStoredProcessedData] = useState<any>(null); // New state to store processed data
  const [combinedInsights, setCombinedInsights] = useState<any>(null);
  const chartRef = useRef<HTMLDivElement>(null); // Ref for the chart container

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.[0] || null);
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:3012/api/analyze-excel", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Error uploading file.");
      const result = await response.json();
      const combinedInsights = result.data?.combinedInsights;
      const processedData = result.data?.processedData;

      if (!processedData) throw new Error("Invalid response structure.");
      console.log("processedData", processedData);

      setStoredProcessedData(processedData); // Store the processed data
      setCombinedInsights(combinedInsights);
      const lightColors = [
        "rgba(173, 216, 230, 0.6)",
        "rgba(144, 238, 144, 0.6)",
        "rgba(255, 182, 193, 0.6)",
        "rgba(255, 228, 181, 0.6)",
        "rgba(221, 160, 221, 0.6)",
        "rgba(240, 230, 140, 0.6)",
      ];

      const generateChartData = (chartType: string): ChartData | null => {
        const chartInfo = processedData[chartType]?.[0];
        if (!chartInfo) return null;

        const labels = Object.keys(chartInfo.data);
        const values = Object.values(chartInfo.data);
console.log("chartType",chartType);

        let chartWidth = 0;
        if (["Line Chart"].includes(chartType)) {
          chartWidth = labels.length * 150;
        } else if (["Bar Chart"].includes(chartType)) {
          chartWidth = labels.length * 150; // Adjust the width for bar chart
        } 
        else if (["Scatter Plot"].includes(chartType)) {
          chartWidth = labels.length * 150; // Adjust the width for bar chart
        }else {
          chartWidth = 400; // Default width for other chart types
        }

        setChartWidth(chartWidth);

        return {
          labels,
          datasets: [
            {
              label: chartInfo.label || chartType,
              data: values as number[],
              backgroundColor: ["Pie Chart", "Donut Chart", "Bar Chart"].includes(chartType)
                ? lightColors.slice(0, labels.length)
                : "rgba(135, 206, 250, 0.6)",
              borderColor: chartType.includes("Line") ? "rgba(135, 206, 250, 1)" : undefined,
              fill: !chartType.includes("Line"),
            },
          ],
          meta: {
            header: chartInfo.header || "default_header",
            valueName: chartInfo.valueName || "default_valueName",
          },
        };
      };

      setChartData({
        scatterChartData: generateChartData("Scatter Plot"),
        pieChartData: generateChartData("Pie Chart"),
        donutChartData: generateChartData("Donut Chart"),
        lineChartData: generateChartData("Line Chart"),
        barChartData: generateChartData("Bar Chart"),
      });
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!inputValue) return;
  
    const graphData = chartData[selectedChart];
    if (!graphData) return;
  
    const labels = graphData.labels;
    const values = graphData.datasets[0].data;
  
    const dataObject = labels.reduce((obj: { [key: string]: number }, label, index) => {
      obj[label] = values[index];
      return obj;
    }, {});
  
    const chartTypeMapping: Record<string, string> = {
      lineChartData: "Line Chart",
      pieChartData: "Pie Chart",
      donutChartData: "Donut Chart",
      barChartData: "Bar Chart",
      scatterChartData: "Scatter Plot",
    };
  
    const selectedChartType = chartTypeMapping[selectedChart] || selectedChart;
  
    // Filter the stored processed data to include only the selected chart's data
    const filteredProcessedData = {
      [selectedChartType]: storedProcessedData[selectedChartType],
    };
  
    const requestBody = {
      question: inputValue,
      processedData: {
        // Include the stored processed data
        [selectedChartType]: [
          {
            header: graphData.meta?.header || "default_header",
            valueName: graphData.meta?.valueName || "default_valueName",
            label: graphData.datasets[0].label,
            data: filteredProcessedData[selectedChartType]?.[0]?.data,
          },
        ],
      },
    };
  
    try {
      const response = await fetch(
        `http://localhost:3012/api/answer-analyze-excel?question=${encodeURIComponent(inputValue)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );
  
      if (!response.ok) throw new Error("Error uploading file.");
      const result = await response.json();
      const processedData = result.data?.processedData;
  
      if (!processedData) throw new Error("Invalid response structure.");
  
      const generateChartData = (chartType: string): ChartData | null => {
        const chartInfo = processedData[chartType]?.[0]; // Use only API response data
        if (!chartInfo) return null;
  
        const labels = Object.keys(chartInfo.data);
        const values = Object.values(chartInfo.data);
        let chartWidth = 0;
        if (["Line Chart"].includes(chartType)) {
          chartWidth = labels.length * 150;
        } else if (["Bar Chart"].includes(chartType)) {
          chartWidth = labels.length * 150; // Adjust the width for bar chart
        } 
        else if (["Scatter Plot"].includes(chartType)) {
          chartWidth = labels.length * 150; // Adjust the width for bar chart
        }else {
          chartWidth = 400; // Default width for other chart types
        }
        setChartWidth(chartWidth);
        return {
          labels,
          datasets: [
            {
              label: chartInfo.label || chartType,
              data: values as number[],
              backgroundColor: ["Pie Chart", "Donut Chart", "Bar Chart"].includes(chartType)
                ? ["rgba(173, 216, 230, 0.6)", "rgba(144, 238, 144, 0.6)", "rgba(255, 182, 193, 0.6)"]
                : "rgba(135, 206, 250, 0.6)",
              borderColor: chartType.includes("Line") ? "rgba(135, 206, 250, 1)" : undefined,
              fill: !chartType.includes("Line"),
            },
          ],
          meta: {
            header: chartInfo.header || "default_header",
            valueName: chartInfo.valueName || "default_valueName",
          },
        };
      };
  
      // Only update chartData without storing in storedProcessedData
      setChartData((prevChartData) => ({
        ...prevChartData,
        [selectedChart]: generateChartData(selectedChartType),
      }));
    } catch (error) {
      console.error("Error sending request:", error);
    } finally {
      setLoading(false);
    }
  };

  const getChartOptions = (type: string) => ({

    responsive: true,
    maintainAspectRatio: false,
    scales: ["pieChartData", "donutChartData"].includes(type)
      ? {}
      : {
        x: {
          ticks: {
            autoSkip: false,
            maxRotation: type === 'barChartData' || type === 'scatterChartData' ? 20 : 100,
            minRotation: type === 'barChartData' || type === 'scatterChartData' ? 0 : 90,
            autoSkipPadding: 20,
          },
          grid: {
            display: true,
            drawTicks: false,
            tickLength: 100,
            lineWidth: 1
          },
        },
        y: {
          beginAtZero: true,
          ticks: { precision: 0 },
        },
      },
    plugins: {
      legend: { display: true, position: "top" },
      tooltip: { enabled: true },
    },
  });


  const renderChart = (type: string, ChartComponent: any) => {
    const data = chartData[type];
    if (!loading && data) {
      return (
        <div className="card p-4 border rounded shadow-sm">
          <div style={{ width: "100%", overflowX: "auto" }}>
            <div style={{ minWidth: ["lineChartData", "barChartData"].includes(type) ? `${chartWidth}px` : "auto", height: "400px" }}>
              <ChartComponent data={data} options={getChartOptions(type)} />
            </div>
          </div>
        </div>
      );
    }
    return null;
  };
  return (
    <div className="flex flex-col md:flex-row h-screen border border-black">
      <div className="w-full md:w-1/4 bg-white p-5 border-t md:border-l md:border-black">
        <h2 className="text-lg font-bold mb-2">Upload File</h2>
        <input type="file" onChange={handleFileChange} className="border p-2 w-full" />
        <button onClick={handleSubmit} className="bg-blue-500 text-white p-2 rounded flex items-center justify-center mt-4">
          <BsUpload className="mr-2" /> Submit
        </button>
        <div className="flex flex-col space-y-2 mt-4">
          {["lineChartData", "barChartData", "scatterChartData", "pieChartData", "donutChartData"].map((type) => (
            <button key={type} onClick={() => setSelectedChart(type)} className="p-2 bg-gray-300 rounded hover:bg-gray-400">
              {type.replace("ChartData", " Chart")}
            </button>
          ))}
        </div>
      </div>
      <div className="w-full md:w-3/4 bg-gray-100 p-5 overflow-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="spinner-border animate-spin border-t-4 border-blue-500 rounded-full w-12 h-12"></div>
          </div>
        ) : (
          selectedChart && renderChart(selectedChart, { lineChartData: Line, barChartData: Bar, scatterChartData: Scatter, pieChartData: Pie, donutChartData: Doughnut }[selectedChart])
        )}
        <div className="mt-4 flex">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="border p-2 flex-grow mr-2 rounded"
            placeholder="Enter your text here"
          />
          <button onClick={handleSend} className="bg-green-500 text-white p-2 rounded">
            Send
          </button>
        </div>
        <div className="mt-4 p-4 border border-gray-300 rounded bg-white">
          <h3 className="text-lg font-bold mb-2">Insights</h3>
          {combinedInsights ? (
            <ol className="list-decimal list-inside text-sm text-gray-700 bg-gray-100 p-2 rounded overflow-auto">
              {combinedInsights.split('\n').map((insight, index) => (
                <ul key={index}>{insight}</ul>
              ))}
            </ol>
          ) : (
            <p className="text-gray-500">No insights available.</p>
          )}
        </div>
      </div>
    </div>
  );
}