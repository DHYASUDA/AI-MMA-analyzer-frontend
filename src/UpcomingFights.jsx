import { useState, useRef, useEffect } from 'react';
import './UpcomingFights.css'
function UpcomingFight(){


    return(
        <div className="main">
            <div className="filterContainer">
                <div className="header"><h2>UFC</h2></div>
                <div className="red-line"></div>                <div className="filter-year">
                    <label>Year: </label>
                    <select>
                        <option>2026</option>
                        <option>2025</option>
                        <option>Upcoming</option>
                    </select>
                </div>
                <div className="fightDisplay">
                <label>Choose event:</label>
                   <select>
                    <option></option>
                   </select>

                </div>
                <div className="event-details">
                    <p className="date">Date:</p>
                    
                    <div className="black-line"></div>
                </div>
                
                <div className="fights">
                    <div className="fighter1">
                        <div className="fighterName1">
                            <h2>Fighter one</h2>
                            
                        </div>
                        <div className="result"><h2>Winner</h2></div>
                    </div>
                    <div className="fighter2">
                        <div className="fighterName2">
                        <h2>Fighter two</h2>

                        </div>
                        <div className="result"><h2>Winner</h2></div>
                    </div>
                </div>
            </div> 
        </div>
    )

} export default UpcomingFight