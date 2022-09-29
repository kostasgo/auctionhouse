//package org.example.auctionhouse.xml;
//
//import org.example.auctionhouse.model.Auction;
//import org.springframework.beans.factory.annotation.Value;
//import org.w3c.dom.Document;
//import org.w3c.dom.Element;
//import org.w3c.dom.Node;
//import org.w3c.dom.NodeList;
//
//import javax.xml.parsers.DocumentBuilder;
//import javax.xml.parsers.DocumentBuilderFactory;
//
//public class XmlParser {
//
//    @Value("${user.dir}")
//    private String userDirectory;
//
//    public void parseFile(String filename) throws Exception{
//        // fake endpoint that returns XML response
//        String filepath = this.userDirectory + "\\ebay-data\\" + filename;
//
//        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
//        DocumentBuilder builder = factory.newDocumentBuilder();
//        Document doc = builder.parse(filepath);
//
//        // normalize XML response
//        doc.getDocumentElement().normalize();
//
//        //read auctions list
//        NodeList nodeList = doc.getElementsByTagName("Item");
//
//        //loop all available student nodes
//        for (int i = 0; i < nodeList.getLength(); i++) {
//
//            Node node = nodeList.item(i);
//
//            if(node.getNodeType() == Node.ELEMENT_NODE) {
//                Element elem = (Element) node;
//                Student student = new Student(
//                        Integer.parseInt(elem.getElementsByTagName("id").item(0).getTextContent()),
//                        elem.getElementsByTagName("first_name").item(0).getTextContent(),
//                        elem.getElementsByTagName("last_name").item(0).getTextContent(),
//                        elem.getElementsByTagName("avatar").item(0).getTextContent()
//                );
//                students.add(student);
//            }
//        }
//
//        //set students in course
//        course.setStudents(students);
//
//
//
//        return course;
//    }
//}
