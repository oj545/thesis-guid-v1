import React, { useState } from 'react';
import Page from '../UI/page';
import { getCheckList } from '../../utils/chekListRequest/getCheckList';
import { useDispatch, useSelector } from 'react-redux';
import { convertToPDF } from '../../helperFanctions/convertFlies';
import './css/checkList.css';
import { getKeyAndValue } from '../../helperFanctions/getKeyAndValue';

function CheckList() {
  const { token, userDetails, htmlString, filesController } = useSelector(
    (state) => state.user
  );

  const [showResulte, setShowResolte] = useState(false);
  const [titles, setTitles] = useState([]);
  const htmlDoc = { __html: htmlString };
  const dispatch = useDispatch();

  const getChecklist = async (e) => {
    e.preventDefault();
    dispatch(getCheckList(token, userDetails.id, titles));
    setShowResolte(true);
  };
  const handleCheckboxChange = (event) => {
    const filterValue = titles.filter((el) => el !== event.target.value);
    event.target.checked
      ? setTitles([...titles, event.target.value])
      : setTitles([...filterValue]);
  };

  const selectALL = (e) => {
    e.preventDefault();
    const allTitles = getKeyAndValue(filesController)
      .filter((el) => el.value.created === true)
      .map((el) => el.title);

    setTitles(allTitles);
  };

  const generatPDF = () => {
    convertToPDF();
  };

  return (
    <Page>
      {userDetails.id && (
        <div>
          {showResulte && (
            <div className="resulte-btns">
              <button
                className="btn btn-lg btn-outline-primary "
                onClick={generatPDF}
              >
                Generat PDF
              </button>

              <button
                className="btn btn-lg btn-outline-secondary "
                onClick={() => setShowResolte(false)}
              >
                Go Back
              </button>
            </div>
          )}
          {showResulte && (
            <div className="resultes">
              <div dangerouslySetInnerHTML={htmlDoc} className="html" />
            </div>
          )}
          {!showResulte && (
            <div className="check-controller">
              <ul className="check-list">
                {getKeyAndValue(filesController).map((sec, index) => {
                  return (
                    <li key={index}>
                      <div className="check-item">
                        <p>{sec.title[0].toUpperCase() + sec.title.slice(1)}</p>
                        <input
                          checked={titles.includes(sec.title)}
                          disabled={!sec.value.created}
                          value={sec.title}
                          type="checkBox"
                          onChange={handleCheckboxChange}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="check-explanation">
                <h2>How to create the final PDF file</h2>
                <p>
                  Click on the checkbox next to the section you want to see, or
                  alternatively, click "Select All" to choose all sections. Once
                  you've made your selection, click on "Show Results." This
                  action will take you to another page. On the new page, locate
                  and click on the "Generate to PDF" button.
                </p>

                <div className="check-btns">
                  <button
                    onClick={selectALL}
                    className="btn btn-outline-primary btn-lg  "
                  >
                    Select All
                  </button>
                  <button
                    onClick={getChecklist}
                    className="btn btn-outline-primary btn-lg  
              "
                  >
                    Show Results
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Page>
  );
}

export default CheckList;
