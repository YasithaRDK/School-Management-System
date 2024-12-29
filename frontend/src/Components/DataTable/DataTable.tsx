import { Button, Table } from "react-bootstrap";
import "./DataTable.scss";

interface IColumn {
  key: string;
  label: string;
}

interface IProps {
  title: string;
  headers: IColumn[];
  data: any[];
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
}

const DataTable: React.FC<IProps> = ({
  title,
  headers,
  data,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="border-container mt-5 mb-5">
      <p className="title-text">{title}</p>
      <Table hover responsive className="custom-table">
        <thead>
          <tr>
            <th>#</th>
            {headers.map((header) => (
              <th key={header.key}>{header.label}</th>
            ))}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td className="fw-bold">{index + 1}</td>
              {headers.map((header) => (
                <td key={header.key}>{item[header.key]}</td>
              ))}
              <td>
                <div className="btn-container">
                  <div>
                    <Button variant="warning" onClick={() => onEdit(item)}>
                      Edit
                    </Button>
                  </div>
                  <div>
                    <Button variant="danger" onClick={() => onDelete(item)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default DataTable;
