import { Table } from "react-bootstrap";
import "./DataTable.scss";
import ActionButton from "../ActionButton/ActionButton";

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
  loading?: number | null;
  actionButtons?: boolean;
  idKey: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  }).format(date);
};

const DataTable: React.FC<IProps> = ({
  title,
  headers,
  data,
  onEdit,
  onDelete,
  loading,
  actionButtons = false,
  idKey,
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
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index}>
                <td className="fw-bold">{index + 1}</td>
                {headers.map((header) => (
                  <td key={header.key}>
                    {header.key === "dateOfBirth"
                      ? formatDate(item[header.key])
                      : item[header.key]}
                  </td>
                ))}
                <td>
                  <div className="btn-container">
                    {actionButtons && (
                      <div>
                        <ActionButton
                          label="Edit"
                          onClick={() => onEdit(item)}
                          variant="warning"
                          disabled={false}
                        />
                      </div>
                    )}
                    <div>
                      <ActionButton
                        label={actionButtons ? "Delete" : "Deallocate"}
                        onClick={() => onDelete(item)}
                        variant="danger"
                        loading={loading === item[idKey]}
                        disabled={loading === item[idKey]}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length + 2} className="text-center">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default DataTable;
