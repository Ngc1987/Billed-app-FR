import { screen } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import userEvent from '@testing-library/user-event'
import Bill from "../containers/Bills.js"
import { ROUTES } from "../constants/routes"
import firebase from "../__mocks__/firebase"

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {
      const html = BillsUI({ data: []})
      document.body.innerHTML = html
      //to-do write expect expression
    })
    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a.date < b.date) ? -1 : 1)
      const antiChrono2 = (a,b) => (new Date(a).getTime() - new Date(b).getTime()) 
      const datesSorted = [...dates].sort(antiChrono2)
      expect(dates).not.toEqual(datesSorted)
    })
  })
  describe("When I am on Bills Page and I click on the new bill button", () => {
    test("Then a new bill page should be open", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const bill = new Bill({ document, onNavigate, firestore: null, localStorage: window.localStorage })
      const handleClickNewBill = jest.fn(bill.handleClickNewBill)
      const buttonNewBill = screen.getByTestId("btn-new-bill")
      buttonNewBill.addEventListener("click", handleClickNewBill)
      userEvent.click(buttonNewBill)
      expect(handleClickNewBill).toHaveBeenCalled()
      expect(screen.getByText('Envoyer une note de frais')).toBeTruthy()
    })
  })
  describe("When I am on Bills Page and I click on the iconEye of one of the bills", () => {
    test("Then a modal with an image should be open", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const bill = new Bill({ document, onNavigate, firestore: null, localStorage: window.localStorage })
      const iconEye = screen.getAllByTestId("icon-eye")[0]
      $.fn.modal = jest.fn();
      const handleClickIconEye = jest.fn(bill.handleClickIconEye(iconEye))
      iconEye.addEventListener("click", handleClickIconEye)
      userEvent.click(iconEye)     
      expect(handleClickIconEye).toHaveBeenCalled()
      expect(screen.getByText('Justificatif')).toBeTruthy()
    })
  })
})

//test d'intégration GET
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Bills UI", () => {
    test("fetches bills from mock API GET", async () => {
       const getSpy = jest.spyOn(firebase, "get")
       const bills = await firebase.get()
       expect(getSpy).toHaveBeenCalledTimes(1)
       expect(bills.data.length).toBeGreaterThanOrEqual(1)
       console.log(bills.data)
    })
    // test("it should show some bills", () => {
    //   const billsParts = screen.getAllByTestId("bill")
    //   console.log(billsParts)
    //   expect(billsParts).toBeInTheDocument()
    //   // expect(billsParts)
    // })
    test("fetches bills from an API and fails with 404 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      )
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("fetches messages from an API and fails with 500 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      )
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})