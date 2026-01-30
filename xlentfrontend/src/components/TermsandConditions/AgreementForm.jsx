    {/* Agreement Form */}
    <div className="card border-0 shadow-sm">
    <div className="card-header bg-primary text-white">
      <h3 className="h4 mb-0">
        <FileCheck size={20} className="me-2" />
        Agreement Acknowledgment
      </h3>
    </div>
    <div className="card-body">
      <form onSubmit={handleSubmit}>
        {/* Agreement Confirmation */}
        <div className="mb-4">
          <div className="alert alert-warning">
            <p className="mb-0 fw-semibold">
              By continuing, you confirm that you have read and understood the above terms and conditions, 
              and you agree to comply with them throughout the rental period.
            </p>
          </div>
        </div>

        {/* Type I AGREE */}
        <div className="mb-4">
          <label htmlFor="agreementText" className="form-label fw-bold">
            Please Type "I AGREE" Below to Confirm: *
          </label>
          <input
            type="text"
            id="agreementText"
            className={`form-control form-control-lg ${agreementText === 'I AGREE' ? 'is-valid' : agreementText && 'is-invalid'}`}
            value={agreementText}
            onChange={(e) => setAgreementText(e.target.value.toUpperCase())}
            placeholder="Type I AGREE here..."
            required
          />
          <div className="form-text">
            Must type exactly "I AGREE" in capital letters
          </div>
          {agreementText === 'I AGREE' && (
            <div className="valid-feedback d-flex align-items-center">
              <CheckCircle size={16} className="me-2" />
              Agreement text confirmed
            </div>
          )}
          {agreementText && agreementText !== 'I AGREE' && (
            <div className="invalid-feedback d-flex align-items-center">
              <AlertCircle size={16} className="me-2" />
              Please type exactly "I AGREE"
            </div>
          )}
        </div>

        {/* Documents Upload Section */}
        <div className="mb-5">
          <h5 className="h6 fw-bold mb-4">Required Documents *</h5>
          
          {/* Driving License */}
          <div className="mb-4">
            <label className="form-label fw-semibold">
              Driving License: *
            </label>
            <div className="border rounded p-3">
              {!files.drivingLicense ? (
                <div className="text-center py-4">
                  <label htmlFor="drivingLicense" className="btn btn-outline-primary btn-lg cursor-pointer">
                    <Upload size={20} className="me-2" />
                    Upload Driving License
                  </label>
                  <input
                    type="file"
                    id="drivingLicense"
                    className="d-none"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => handleFileUpload(e, 'drivingLicense')}
                  />
                  <p className="text-muted small mt-2 mb-0">
                    Accepted formats: JPG, PNG, PDF (Max 5MB)
                  </p>
                </div>
              ) : (
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <FileText size={24} className="text-primary me-3" />
                    <div>
                      <div className="fw-bold">{files.drivingLicense.name}</div>
                      <div className="text-muted small">
                        {(files.drivingLicense.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeFile('drivingLicense')}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Aadhaar Card Front */}
          <div className="mb-4">
            <label className="form-label fw-semibold">
              Aadhaar Card (Front): *
            </label>
            <div className="border rounded p-3">
              {!files.aadhaarFront ? (
                <div className="text-center py-4">
                  <label htmlFor="aadhaarFront" className="btn btn-outline-primary btn-lg cursor-pointer">
                    <Upload size={20} className="me-2" />
                    Upload Aadhaar Front
                  </label>
                  <input
                    type="file"
                    id="aadhaarFront"
                    className="d-none"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => handleFileUpload(e, 'aadhaarFront')}
                  />
                  <p className="text-muted small mt-2 mb-0">
                    Clear image of Aadhaar card front side
                  </p>
                </div>
              ) : (
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <FileText size={24} className="text-primary me-3" />
                    <div>
                      <div className="fw-bold">{files.aadhaarFront.name}</div>
                      <div className="text-muted small">
                        {(files.aadhaarFront.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeFile('aadhaarFront')}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Aadhaar Card Back */}
          <div className="mb-4">
            <label className="form-label fw-semibold">
              Aadhar Card (Back): *
            </label>
            <div className="border rounded p-3">
              {!files.aadhaarBack ? (
                <div className="text-center py-4">
                  <label htmlFor="aadhaarBack" className="btn btn-outline-primary btn-lg cursor-pointer">
                    <Upload size={20} className="me-2" />
                    Upload Aadhaar Back
                  </label>
                  <input
                    type="file"
                    id="aadhaarBack"
                    className="d-none"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => handleFileUpload(e, 'aadhaarBack')}
                  />
                  <p className="text-muted small mt-2 mb-0">
                    Clear image of Aadhaar card back side
                  </p>
                </div>
              ) : (
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <FileText size={24} className="text-primary me-3" />
                    <div>
                      <div className="fw-bold">{files.aadhaarBack.name}</div>
                      <div className="text-muted small">
                        {(files.aadhaarBack.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeFile('aadhaarBack')}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Final Checkbox */}
        <div className="mb-4">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="finalAgreement"
              checked={agreeChecked}
              onChange={(e) => setAgreeChecked(e.target.checked)}
              required
            />
            <label className="form-check-label fw-semibold" htmlFor="finalAgreement">
              I hereby confirm that all information provided is true and accurate. 
              I understand that providing false information may result in cancellation 
              of my booking and forfeiture of the advance amount.
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="d-grid gap-2">
          <button
            type="submit"
            className="btn btn-primary btn-lg py-3"
            disabled={!agreeChecked || agreementText !== 'I AGREE' || 
                     !files.drivingLicense || !files.aadhaarFront || !files.aadhaarBack}
          >
            <ThumbsUp size={20} className="me-2" />
            Accept Terms & Proceed to Payment (₹500)
          </button>
          <Link to="/" className="btn btn-outline-secondary">
            Cancel and Return Home
          </Link>
        </div>
      </form>
    </div>
  </div>