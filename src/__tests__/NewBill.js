import { screen, fireEvent, waitFor } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import "@testing-library/jest-dom"
import { ROUTES } from "../constants/routes"
import { localStorageMock } from "../__mocks__/localStorage.js"
import user from '@testing-library/user-event';
import {setLocalStorage} from "../__mocks__/localStorage"
import firestore from "../app/Firestore.js"
import firebase from "../__mocks__/firebase"
import BillsUI from "../views/BillsUI.js"

const onNavigate = (pathname) => {
  document.body.innerHTML = ROUTES({ pathname })
}
setLocalStorage('Employee')
Object.defineProperty(window, "location", { value: { hash: "#employee/bill/new" } })



describe("Given I am connected as an employee", () => {
  describe("When I access NewBill Page", () => {
    test("Then the newBill page should be rendered", () => {
      document.body.innerHTML = NewBillUI()
      expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy()
    })
    test("Then a form with nine fields should be rendered", () => {
      document.body.innerHTML = NewBillUI()
      const form = document.querySelector("form")
      expect(form.length).toEqual(9)
    })
  })

  
  describe("When I'm on NewBill Page", () => {
    describe("And I upload a image file", () => {
      
      test("Then the file handler should show a file", () => {
        document.body.innerHTML = NewBillUI()
        const newBill = new NewBill({ document, onNavigate, firestore: firestore, localStorage: window.localStorage })
        const handleChangeFile = jest.fn(() => newBill.handleChangeFile)
        const inputFile = screen.getByTestId("file")
        // console.log(inputFile)
        inputFile.addEventListener("change", handleChangeFile)
        fireEvent.change(inputFile, {
            target: {
                files: [new File(["sample.jpg"], "sample.jpg", { type: "text/jpg" })],
            }
        })
        const numberOfFile = screen.getByTestId("file").files.length
        expect(handleChangeFile).toBeCalled()
        expect(numberOfFile).toEqual(1)
      })
    })
    describe("And I upload a non-image file", () => {
      test("Then the error message should be display", () => {
        document.body.innerHTML = NewBillUI()
        const newBill = new NewBill({ document, onNavigate, firestore: firestore, localStorage: window.localStorage })
        const handleChangeFile = jest.fn(() => newBill.handleChangeFile)
        const inputFile = screen.getByTestId("file")
        inputFile.addEventListener("change", handleChangeFile)
        fireEvent.change(inputFile, {
            target: {
                files: [new File(["sample.txt"], "sample.txt", { type: "text/txt" })],
            }
        })
        expect(handleChangeFile).toBeCalled()
        expect(inputFile.files[0].name).toBe("sample.txt")
        expect(document.querySelector("#error").style.display).toBe("flex")
      })
    })
    describe("And I submit a valid bill form", () => {
      test('then a bill is created', async () => {
        document.body.innerHTML = NewBillUI()
        const newBill = new NewBill({ document, onNavigate, firestore: firestore, localStorage: window.localStorage })
        const submit = screen.getByTestId('form-new-bill')
        const validBill = {
          name: "validBill",
          date: "2021-08-07",
          type: "Transports",
          amount: 69,
          pct: 20,
          vat: "30",
          fileName: "test.jpg",
          fileUrl: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fcpmr-islands.org%2Ffr%2Ftest-2%2F&psig=AOvVaw2rc0xMNUSvTgUJ1cd3dHy_&ust=1631350098263000&source=images&cd=vfe&ved=2ahUKEwiAupTqgvTyAhWv0eAKHepTCmQQjRx6BAgAEAk"
        }
        const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))
        newBill.createBill = (newBill) => newBill
        document.querySelector(`input[data-testid="expense-name"]`).value = validBill.name
        document.querySelector(`input[data-testid="datepicker"]`).value = validBill.date
        document.querySelector(`select[data-testid="expense-type"]`).value = validBill.type
        document.querySelector(`input[data-testid="amount"]`).value = validBill.amount
        document.querySelector(`input[data-testid="vat"]`).value = validBill.vat
        document.querySelector(`input[data-testid="pct"]`).value = validBill.pct
        document.querySelector(`textarea[data-testid="commentary"]`).value = validBill.commentary
        newBill.fileUrl = validBill.fileUrl
        newBill.fileName = validBill.fileName 
        submit.addEventListener('click', handleSubmit)
        fireEvent.click(submit)
        expect(handleSubmit).toHaveBeenCalled()
        // expect(screen.getByText('Mes notes de frais')).toBeTruthy()
        await waitFor(() => {
          expect(screen.getByText("Mes notes de frais").classList.contains("content-title")).toBe(true)
        })
      })
    })
  })
    
})


//test d'intégration POST
describe("Given I am a user connected as Employee", () => {
  describe("When I create a new bill", () => {
    test("Add bill to mock API POST", async () => {
      const getSpy = jest.spyOn(firebase, "post")
      
      const newBill = {
        id: "47qAXb6fIm2zOKkLzMro",
        vat: "80",
        fileUrl: "https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
        status: "pending",
        type: "Hôtel et logement",
        commentary: "séminaire billed",
        name: "encore",
        fileName: "preview-facture-free-201801-pdf-1.jpg",
        date: "2004-04-04",
        amount: 400,
        commentAdmin: "ok",
        email: "a@a",
        pct: 20
      };
      const bills = await firebase.post(newBill)
      expect(getSpy).toHaveBeenCalledTimes(1)
      expect(bills.data.length).toBe(5)
    })
    test("fetches bills from an API and fails with 404 message error", async () => {
      firebase.post.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      )
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("fetches messages from an API and fails with 500 message error", async () => {
      firebase.post.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      )
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})


