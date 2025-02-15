import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ListCard.css';

const ListCard = () => {
    const [stadiums, setStadiums] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:4000/api/arenas/getArenas')
            .then((response) => {
                setStadiums(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <div className="stadium-container">
            <h2 className="recommend-title">สถานที่แนะนำ</h2>
            <div className="stadium-list">
                {stadiums.slice(0, 8).map((stadium) => (
                    <div key={stadium._id} className="stadium-card">
                        <img
                            src={stadium.images && stadium.images.length > 0 ? stadium.images[0] : 'https://via.placeholder.com/150'}
                            alt={stadium.fieldName}
                            className="stadium-image"
                        />
                        <div className="stadium-info">
                            <h3>{stadium.fieldName}</h3>
                            <p>โทร: {stadium.phone}</p>
                            <p>เวลาเปิด: {stadium.startTime} - {stadium.endTime}</p>
                            <p>
                                พิกัด: {stadium.location && stadium.location.coordinates
                                    ? stadium.location.coordinates.join(', ')
                                    : 'ไม่มีข้อมูลพิกัด'}
                            </p>
                            
                        </div>
                    </div>
                ))}
            </div>
        </div>


    );
};

export default ListCard;
