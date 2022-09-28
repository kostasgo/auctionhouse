package org.example.auctionhouse.controller;

import org.example.auctionhouse.model.*;
import org.example.auctionhouse.payload.request.AuctionRequest;
import org.example.auctionhouse.payload.request.BuyOutRequest;
import org.example.auctionhouse.payload.request.EnableUserRequest;
import org.example.auctionhouse.payload.response.MessageResponse;
import org.example.auctionhouse.repository.AuctionRepository;
import org.example.auctionhouse.repository.CategoryRepository;
import org.example.auctionhouse.service.AuctionService;
import org.example.auctionhouse.service.MessageService;
import org.example.auctionhouse.service.SellerService;
import org.example.auctionhouse.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.xml.bind.DatatypeConverter;
import java.io.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

import static org.springframework.util.MimeTypeUtils.APPLICATION_JSON_VALUE;


@RequestMapping("/api/v1/auctions")
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
public class AuctionController {

    @Autowired
    private AuctionService auctionService;

    @Autowired
    private AuctionRepository auctionRepository;

    @Value("${user.dir}")
    private String userDirectory;
    @Autowired
    private UserService userService;

    @Autowired
    private SellerService sellerService;

    @Autowired
    private MessageService messageService;

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping
    ResponseEntity<Collection<Auction>> findAll(){
        return new ResponseEntity<>(auctionService.findAll(), HttpStatus.OK);
    }

    @GetMapping("{id}")
    ResponseEntity<Auction> findById(@PathVariable("id") Long id){
        return new ResponseEntity<>(auctionService.findById(id), HttpStatus.OK);
    }

    @GetMapping(params = {"id", "offset"})
    ResponseEntity<Collection<Auction>> findAllUserAuctions(@RequestParam("id") Integer id, @RequestParam("offset") Integer offset){
        return new ResponseEntity<>(auctionService.findAllUserAuctions(id, offset), HttpStatus.OK);
    }
    @GetMapping(params = {"id", "count"})
    ResponseEntity<Integer> findAllUserAuctionsCount(@RequestParam("id") Integer id, @RequestParam("count") Boolean count){
        return new ResponseEntity<>(auctionService.findAllUserAuctionsCount(id), HttpStatus.OK);
    }

    @GetMapping(params = {"search","max","category","country","active", "id", "offset"})
    ResponseEntity<Collection<Auction>> searchAuctions(@RequestParam("search") Optional<String> search,@RequestParam("max") Optional<Integer> max,@RequestParam("category") Optional<String> category,@RequestParam("country") Optional<String> country,@RequestParam("active") Optional<Boolean> active, @RequestParam("id") Optional<Integer> id, @RequestParam("offset") Optional<Integer> offset){
        System.out.print("in search (non-user) active in controller");
        return new ResponseEntity<>(auctionService.searchAuctions(search.orElse("%"),max.orElse(100000),category.orElse("%"),country.orElse("%"),active.orElse(true),id.orElse(-1), offset.orElse(0)), HttpStatus.OK);
    }

    @GetMapping(params = {"search","max","category","country", "active", "id", "count"})
    ResponseEntity<Integer> searchAuctionsCount(@RequestParam("search") Optional<String> search,@RequestParam("max") Optional<Integer> max,@RequestParam("category") Optional<String> category,@RequestParam("country") Optional<String> country,@RequestParam("active") Optional<Boolean> active, @RequestParam("id") Optional<Integer> id, @RequestParam("count") Optional<Boolean> count){
        System.out.print(active.orElse(true));
        System.out.print(id.orElse(-1));
        return new ResponseEntity<>(auctionService.searchAuctionsCount(search.orElse("%"),max.orElse(100000),category.orElse("%"),country.orElse("%"),active.orElse(true),id.orElse(-1)), HttpStatus.OK);
    }


    @PostMapping("/new_auction")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> newAuction(@Valid @RequestBody AuctionRequest auctionRequest){
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

        User user = userService.findByUsername(auctionRequest.getUsername()).get();

        Seller seller = user.getSeller();
        if (seller == null) {
            seller = new Seller(user);
            sellerService.saveOrUpdate(seller);
        }

        Set<String> strCategories = auctionRequest.getCategories();
        List<Category> categories = new ArrayList<>();


        strCategories.forEach(category -> {
            Category cat = categoryRepository.findByName(category)
                    .orElseThrow(() -> new RuntimeException("Error: Category is not found."));
            if(cat!=null) categories.add(cat);
        });

        LocalDateTime ends = LocalDateTime.parse(auctionRequest.getEnds(), formatter);

        Auction auction = new Auction(seller, auctionRequest.getName(), auctionRequest.getDescription(), auctionRequest.getCountry(),
                auctionRequest.getLocation() , auctionRequest.getLatitude(), auctionRequest.getLongitude() , LocalDateTime.now(), ends, categories,
                auctionRequest.getBuyPrice(), auctionRequest.getFirstBid(), "");

        String[] strImages = auctionRequest.getImages();
        String[] imageNames = auctionRequest.getImageNames();
        char first = auctionRequest.getName().charAt(0);
        String staticPath = userDirectory+"\\src\\main\\resources\\static\\media\\auction\\"+Character.toString(Character.toLowerCase(first));
        String targetPath = userDirectory+"\\target\\classes\\static\\media\\auction\\"+Character.toString(Character.toLowerCase(first));

        String urls = "";

        File directory = new File(staticPath);
        File targetDirectory = new File(targetPath);
        if (!directory.exists()){
            directory.mkdirs();
            targetDirectory.mkdirs();
        }

        for (int i = 0; i < strImages.length; i++){

            String base64String = strImages[i];
            String[] parts = base64String.split(",");
            //convert base64 string to binary data
            byte[] data = DatatypeConverter.parseBase64Binary(parts[1]);

            String fileName = staticPath + "\\" + imageNames[i];
            String targetName = targetPath + "\\" + imageNames[i];
            File file = new File(fileName);
            File target = new File(targetName);
            if (urls != "") urls += ",";
            String finalUrl = "http://localhost:8080/media/auction/"+Character.toString(Character.toLowerCase(first))+"/"+imageNames[i];
            urls += finalUrl;
            try (OutputStream outputStream = new BufferedOutputStream(new FileOutputStream(file))) {
                outputStream.write(data);
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Error: Could not create an image"));

            }
            try (OutputStream outputStream = new BufferedOutputStream(new FileOutputStream(target))) {
                outputStream.write(data);
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Error: Could not create an image in trace"));
            }
        }
        auction.setImgUrl(urls);

        auctionService.saveOrUpdate(auction);
        return ResponseEntity.ok(new MessageResponse("Auction successfully created!"));
    }

    @PostMapping("/enable")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> enableAuction(@Valid @NotBlank @RequestBody Map<String, Long> body){
        Long id = body.get("auction_id");
        Auction auction = auctionService.findById(id);

        auction.setActive(true);

        auctionService.saveOrUpdate(auction);

        return ResponseEntity.ok(auction);
    }

    @PostMapping(value = "/buyout", consumes = APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> buyOutAuction(@Valid @RequestBody BuyOutRequest buyOutRequest){
        User user = userService.findByUsername(buyOutRequest.getUsername()).get();
        Auction auction = auctionService.findById(buyOutRequest.getAuction_id());

        auction.setBoughtOut(true);
        auction.setCompleted(true);
        auction.setActive(false);

        auctionService.saveOrUpdate(auction);

        Long receiverId = auction.getSeller().getUser().getId();
        Long senderId = user.getId();
        String msg = "Hello, I just won the auction " + auction.getId() + " (" + auction.getName() + ").\n" +
                "You can contact me to arrange payment and delivery.\n" +
                "Phone Number: "+user.getPhone()+"\n" +
                "Email: "+user.getEmail();

        Message message = new Message(msg, senderId, receiverId);
        messageService.saveOrUpdate(message);
        return ResponseEntity.ok(auction);
    }

    @DeleteMapping("/delete/{id}")
    //@PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> deleteAuction(@PathVariable("id") Long id){
        auctionRepository.deleteById(id);
        return ResponseEntity.ok(new MessageResponse("Auction successfully deleted!"));
    }

}
