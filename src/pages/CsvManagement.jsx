import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { read, utils, writeFile } from "xlsx";

const CsvManagement = () => {
  const [data, setData] = useState([]);
  const [newRow, setNewRow] = useState({});

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const workbook = read(e.target.result, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = utils.sheet_to_json(sheet, { header: 1 });
      setData(json);
    };
    reader.readAsBinaryString(file);
  };

  const handleInputChange = (event, rowIndex, colIndex) => {
    const updatedData = [...data];
    updatedData[rowIndex][colIndex] = event.target.value;
    setData(updatedData);
  };

  const handleNewRowChange = (event, colIndex) => {
    const updatedNewRow = { ...newRow, [colIndex]: event.target.value };
    setNewRow(updatedNewRow);
  };

  const handleAddRow = () => {
    const updatedData = [...data, Object.values(newRow)];
    setData(updatedData);
    setNewRow({});
  };

  const handleDeleteRow = (rowIndex) => {
    const updatedData = data.filter((_, index) => index !== rowIndex);
    setData(updatedData);
  };

  const handleDownload = () => {
    const worksheet = utils.aoa_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Sheet1");
    writeFile(workbook, "edited_data.csv");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CSV Management</h1>
      <div className="mb-4">
        <Input type="file" accept=".csv" onChange={handleFileUpload} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {data[0] && data[0].map((_, colIndex) => (
              <TableHead key={colIndex}>Column {colIndex + 1}</TableHead>
            ))}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.slice(1).map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.map((cell, colIndex) => (
                <TableCell key={colIndex}>
                  <Input
                    value={cell}
                    onChange={(event) => handleInputChange(event, rowIndex + 1, colIndex)}
                  />
                </TableCell>
              ))}
              <TableCell>
                <Button variant="destructive" onClick={() => handleDeleteRow(rowIndex + 1)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            {data[0] && data[0].map((_, colIndex) => (
              <TableCell key={colIndex}>
                <Input
                  value={newRow[colIndex] || ""}
                  onChange={(event) => handleNewRowChange(event, colIndex)}
                />
              </TableCell>
            ))}
            <TableCell>
              <Button onClick={handleAddRow}>Add Row</Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div className="mt-4">
        <Button onClick={handleDownload}>Download CSV</Button>
      </div>
    </div>
  );
};

export default CsvManagement;